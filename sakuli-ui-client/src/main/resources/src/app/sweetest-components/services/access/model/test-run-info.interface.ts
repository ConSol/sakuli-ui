export interface TestRunInfoPorts {
  vnc: number;
  web: number;
}

export interface TestRunInfo {
  gateway: string;
  testRunInfoPortList: TestRunInfoPorts[];
  executionId:string;
  containerId: string;
}
