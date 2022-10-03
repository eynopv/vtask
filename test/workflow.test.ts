/*
import { describe, expect, test } from '@jest/globals';
import { Workflow, Step, BeginStep, WaitStep, StartStationStep, StopStationStep, parse, stepisize } from '../src/workflow';
import { getTimestamp } from '../src/common';


const WORKFLOW = `
Begin
Start station 1
Wait 5
Start station 2
Wait 10
Start station all
Wait 10
Stop station 2
Wait 10
Stop station 3
Wait 5
Stop station all
End
`;

const WORKFLOW_PARSED = [
  'Begin',
  'Start station 1',
  'Wait 5',
  'Start station 2',
  'Wait 10',
  'Start station all',
  'Wait 10',
  'Stop station 2',
  'Wait 10',
  'Stop station 3',
  'Wait 5',
  'Stop station all',
  'End'
];

describe('Workflow', () => {
  test('check splitting', () => {
    expect(parse(WORKFLOW)).toEqual(WORKFLOW_PARSED);
  });

  test('stepisize', () => {
    const stepisized = stepisize(WORKFLOW_PARSED);
    for (let i = 0; i < WORKFLOW_PARSED.length; i++) {
      expect(stepisized[i].name).toEqual(WORKFLOW_PARSED[i]);
    }
  });

  test('setup', async () => {
    const workflow = new Workflow(WORKFLOW);
    await workflow.setup();
    expect(workflow.stations.length).toEqual(5);
  });

  test('report', async () => {
    const workflow = new Workflow(WORKFLOW);
    await workflow.setup();
    expect(workflow.prepareReport()).toEqual(false);
  });
});

describe('BeginStep', () => {
  test('calculate should set current timestamp', async () => {
    const step = new BeginStep('Begin');
    await step.calculate();
    expect(step.timestamp).toEqual(getTimestamp());
  });
});

describe('WaitStep', () => {
  test('calculate wait step', async () => {
    const previousStep = new Step('Previous Step');
    const timestamp = getTimestamp();
    previousStep.timestamp = timestamp;
    
    const stepName = 'Wait 10';
    const waitStep = new WaitStep(stepName, previousStep);
    const expectedTimestamp = timestamp + 10;

    await waitStep.calculate();
    expect(waitStep.timestamp).toEqual(expectedTimestamp);
  });
});


// Those test should be run on clean db with data from populate script
describe('StartStationStep', () => {
  const ALL_STATIONS = [ 1, 2, 3, 4, 5 ];
  const TOTAL_POWER = ALL_STATIONS.length * 10;

  test('startAllStations should set ', async () => {
    const workflow = new Workflow(`Begin
                                  End`);
    await workflow.setup();

    const startStationStep = new StartStationStep('Start station all');
    startStationStep.workflow = workflow;

    await startStationStep.startAllStations();
    expect(startStationStep.totalChargingStations).toEqual(ALL_STATIONS);
  });

  test('calculate start station step with "all" parameter', async () => {
    const workflow = new Workflow(`Begin
                                  End`);
    await workflow.setup();

    const previousStep = new Step('Previous Step');
    const timestamp = getTimestamp();
    previousStep.timestamp = timestamp;

    const stepName = 'Start station all';
    const startStationStep = new StartStationStep(stepName, previousStep);
    startStationStep.workflow = workflow;
    await startStationStep.calculate();

    expect(startStationStep.totalChargingStations).toEqual(ALL_STATIONS);
    expect(startStationStep.totalChargingPower).toEqual(TOTAL_POWER);
  });
});
*/
