import { getTimestamp } from './common';
import { PopulatedStation, listPopulatedStations } from './db/station';

export function parse(workflow: string) {
  const splitted = workflow.split('\n').map((v) => v.trim()).filter((v) => v);
  return splitted;
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
  state: WorkflowState;
  reports: Report[];

  constructor(script: string) {
    this.commands = parse(script);
    this.reports = [];
    this.state = new WorkflowState();

    if (!this.commands.length) throw new Error('Empty script');
    if (this.commands[0] !== 'Begin') throw new Error('Script should start from "Begin"');
    if (this.commands[this.commands.length - 1] !== 'End') throw new Error('Script should end with "End"');
  }

  async setup() {
    const stations = await listPopulatedStations();
    this.stations = stations;
  }

  run() {
    for (const command of this.commands) {
      const commandRunner = this.getCommand(command);
      const report = commandRunner.execute();
      if (report) {
        this.reports.push(report);
      }
    }

    return this.reports;
  }

  getCommand(command: string) {
    const params = command.split(' ');

    if (params[0] === 'Begin') {
      return new BeginCommand(command, this);
    }

    if (params[0] === 'Wait') {
      return new WaitCommand(command, this);
    }

    if (params[0] === 'Start') {
      if (params[2] === 'all') {
        return new StartAllStationsCommand(command, this);
      }

      return new StartStationCommand(command, this);
    }

    if (params[0] === 'Stop') {
      if (params[2] === 'all') {
        return new StopAllStationsCommand(command, this);
      }

      return new StopStationCommand(command, this);
    }

    if (params[0] === 'End') {
      return new EndCommand(command, this);
    }

    throw new Error(`Unknown command: ${command}`);
  }
}

class WorkflowState {
  timestamp: number;
  companies: CompanyReport[];
  totalChargingStations: number[];
  totalChargingPower: number;

  constructor() {
    this.timestamp = 0;
    this.companies = [];
    this.totalChargingStations = [];
    this.totalChargingPower = 0;
  }

  report() {
    return {
      timestamp: this.timestamp,
      companies: this.companies,
      totalChargingStations: this.totalChargingStations,
      totalChargingPower: this.totalChargingPower
    };
  }
}

export class Command {
  name: string;
  workflow: Workflow;

  constructor(name: string, workflow: Workflow) {
    this.name = name;
    this.workflow = workflow;
  }

  getTimestamp() {
    return this.workflow.state.timestamp;
  }

  setTimestamp(value: number) {
    this.workflow.state.timestamp = value;
  }

  calculateCompanies() {
    const stations = this.getChargingStations();
    const companies: CompanyReport[] = [];

    for (const s of stations) {
      const companyId = s.companyId;
      const companyReport = companies.find((c) => c.id === companyId);

      if (companyReport) {
        companyReport.chargingStations.push(s.id);
        companyReport.chargingPower += s.maxPower;
      } else {
        companies.push({
          id: companyId,
          chargingStations: [ s.id ],
          chargingPower: s.maxPower
        });
      }

      if (s.parentCompany) {
        const parentReport = companies.find((c) => c.id === s.parentCompany);
      
        if (parentReport) {
          parentReport.chargingStations.push(s.id);
          parentReport.chargingPower += s.maxPower;
        } else {
          companies.push({
            id: s.parentCompany,
            chargingStations: [ s.id ],
            chargingPower: s.maxPower
          });
        }
      }
    }

    this.workflow.state.companies = companies
  }

  calculateTotalChargingPower() {
    const stations = this.getChargingStations();
    this.workflow.state.totalChargingPower = stations.reduce((accumulator, s) => accumulator + s.maxPower, 0);
  }

  getAllStationIds() {
    return this.workflow.stations.map((station) => station.id);
  }


  getChargingStations() {
    const chargingStationIds = this.getTotalChargingStations();
    return this.workflow.stations.filter((s) => chargingStationIds.includes(s.id));
  }

  getTotalChargingStations() {
    return this.workflow.state.totalChargingStations;
  }

  setTotalChargingStations(value: number[]) {
    this.workflow.state.totalChargingStations = value;
  }

  execute(): Report|null {
    return this._report();
  }

  _report() {
    const report = Object.assign({
      step: this.name
    }, this.workflow.state.report());

    return report;
  }
}

export class BeginCommand extends Command {
  execute() {
    this.setTimestamp(getTimestamp()); 
    return this._report();
  }
}

export class EndCommand extends Command {
  execute() {
    return this._report();
  }
}

export class WaitCommand extends Command {
  execute() {
    this.setTimestamp(this.getTimestamp() + Number(this.name.split(' ')[1]));
    return null;
  }
}

export class StartAllStationsCommand extends Command {
  execute() {
    this.setTotalChargingStations(this.getAllStationIds());

    this.calculateTotalChargingPower();
    this.calculateCompanies();

    return this._report();
  }
}

export class StartStationCommand extends Command {
  execute() {
    const params = this.name.split(' ');
    const chargingStations = this.getTotalChargingStations();
    const stationId = Number(params[2]);

    if (!chargingStations.includes(stationId)) {
      this.setTotalChargingStations(chargingStations.concat([ stationId ]));
    }

    this.calculateTotalChargingPower();
    this.calculateCompanies();

    return this._report();
  }
}

export class StopStationCommand extends Command {
  execute() {
    const params = this.name.split(' ');
    const stationId = Number(params[2]);
    const chargingStations = this.getTotalChargingStations().filter((id) => stationId !== id);
    this.setTotalChargingStations(chargingStations);

    this.calculateTotalChargingPower();
    this.calculateCompanies();

    return this._report();
  }
}

export class StopAllStationsCommand extends  Command {
  execute() {
    this.setTotalChargingStations([]);

    this.calculateTotalChargingPower();
    this.calculateCompanies();

    return this._report();
  }
}
