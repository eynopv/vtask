import { getTimestamp } from './common';
import { PopulatedStation, listPopulatedStations } from './db/station';

export function parse(workflow: string) {
  const splitted = workflow.split('\n').map((v) => v.trim()).filter((v) => v);
  return splitted;
}

export function stepisize(parsedWorkflow: string[]): Step[] {
  return parsedWorkflow.map((stepName) => {
    return new Step(stepName);
  });
}

type Report = {
  step: string,
  timestamp: number,
  companies: CompanyReport[],
  totalChargingStations: number[],
  totalChargingPower: number
};

type CompanyReport = {
  id: number,
  chargingStations: number[],
  chargingPower: number
}

export class Workflow {
  stations: PopulatedStation[] = [];
  commands: string[] = [];
  steps: (BeginStep|WaitStep|StartStationStep|StopStationStep)[] = [];

  constructor(script: string) {
    this.commands = parse(script);
    if (!this.commands.length) throw new Error('Empty script');
    if (this.commands[0] !== 'Begin') throw new Error('Script should start from "Begin"');
    if (this.commands[this.commands.length - 1] !== 'End') throw new Error('Script should end with "End"');
  }

  async setup() {
    const stations = await listPopulatedStations();
    this.stations = stations;

    for (let i = 0; i < this.commands.length; i++) {
      const command = this.commands[i];
      let previousStep = null;
      if (i > 0) {
        previousStep = this.steps[i - 1];
      }

      let step;
      const params = command.split(' ');
      if (params[0] === 'Begin') {
        step = new BeginStep(command, previousStep);
      } else if (params[0] === 'Wait') {
        step = new WaitStep(command, previousStep);
      } else if (params[0] === 'Start') {
        step = new StartStationStep(command, previousStep);
      } else if (params[0] === 'Stop') {
        step = new StopStationStep(command, previousStep);
      } else if (params[0] === 'End') {
        step = new EndStep(command, previousStep);
      } else {
        throw new Error(`Unknown Step: ${params[0]}`);
      }
      step.workflow = this;
      this.steps.push(step);
    }
  }

  prepareReport() {
    console.log("Steps", this.steps);
    const reports = [];
    for (const step of this.steps) {
      const report = step.calculate().report();
      if (report) reports.push(report);
    }
    return reports;
  }
}

export class Step {
  workflow: Workflow|null = null;
  name: string = '';
  timestamp: number = 0;
  companies: CompanyReport[] = [];
  totalChargingStations: number[] = [];
  totalChargingPower: number = 0;
  previousStep: Step|null = null;

  constructor(name: string, previousStep: Step|null = null) {
    this.name = name;
    this.previousStep = previousStep;
    if (this.previousStep) {
      this.timestamp = this.previousStep.timestamp;
    }
  }

  calculate() {
    return this;
  }

  calculateState() {
    const stations = (this.workflow?.stations || []).filter((s) => this.totalChargingStations.includes(s.id));
    this.totalChargingPower = stations.reduce((accumulator, s) => accumulator + s.maxPower, 0);
    this.companies = [];

    for (const s of stations) {
      const companyId = s.companyId;
      const companyReport = this.companies.find((c) => c.id === companyId);

      if (companyReport) {
        companyReport.chargingStations.push(s.id);
        companyReport.chargingPower += s.maxPower;
      } else {
        this.companies.push({
          id: companyId,
          chargingStations: [ s.id ],
          chargingPower: s.maxPower
        });
      }

      if (s.parentCompany) {
        const parentReport = this.companies.find((c) => c.id === s.parentCompany);
      
        if (parentReport) {
          parentReport.chargingStations.push(s.id);
          parentReport.chargingPower += s.maxPower;
        } else {
          this.companies.push({
            id: s.parentCompany,
            chargingStations: [ s.id ],
            chargingPower: s.maxPower
          });
        }
      }
    }
  }

  report(): Report|null {
    return {
      step: this.name,
      timestamp: this.timestamp,
      companies: this.companies,
      totalChargingStations: this.totalChargingStations,
      totalChargingPower: this.totalChargingPower
    }
  }
}

export class BeginStep extends Step {
  calculate() {
    this.timestamp = getTimestamp(); 
    return this;
  }
}

export class EndStep extends Step {
  calculate() {
    this.timestamp = this.previousStep?.timestamp || 0;
    this.totalChargingStations = copyArray(this.previousStep?.totalChargingStations || []);
    return this;
  }
}

export class WaitStep extends Step {
  calculate() {
    const [ name, time ] = this.name.split(' ');
    const previousTimestamp = this.previousStep?.timestamp || 0;
    this.timestamp = Number(time) + previousTimestamp;
    this.totalChargingStations = copyArray(this.previousStep?.totalChargingStations || []);
    return this;
  }

  report() {
    return null;
  }
}

export class StartStationStep extends Step {
  calculate() {
    this.timestamp = this.previousStep?.timestamp || 0;
    const params = this.name.split(' ');

    if (params[2] === 'all') {
      this.startAllStations();
    } else {
      this.startStation(Number(params[2]));
    }

    this.calculateState();

    return this;
  }

  startAllStations() {
    this.totalChargingStations = this.workflow?.stations.map((station) => station.id) || [];
    return this;
  }

  startStation(stationId: number) {
    this.totalChargingStations = copyArray(this.previousStep?.totalChargingStations || []);
    if (!this.totalChargingStations.includes(stationId)) {
      this.totalChargingStations.push(stationId);
    }
    return this;
  }
}

export class StopStationStep extends Step {
  calculate() {
    this.timestamp = this.previousStep ? this.previousStep.timestamp : 0;
    const params = this.name.split(' ');

    if (params[2] === 'all') {
      this.stopAllStations();
    } else {
      this.stopStation(Number(params[2]));
    }

    this.calculateState();

    return this;
  }

  stopAllStations() {
    this.totalChargingStations = [];
    return this;
  }

  stopStation(stationId: number) {
    const chargingStations = copyArray(this.previousStep?.totalChargingStations || []);
    this.totalChargingStations = chargingStations.filter((id) => id !== stationId);
    return this;
  }
}

function copyArray(arr: any[]) {
  return [...arr];
}
