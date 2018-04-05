export interface TestRunInfoPorts {
  vnc: number;
  web: number;
}

export interface TestRunInfo {
  testRunInfoPortList: TestRunInfoPorts[];
  executionId:string;
  containerId: string;
}
