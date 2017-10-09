export interface BaseResult {
  name: string;
  state: string;
  resultCode: string;
  dbPrimaryKey: string;
  duration: number;
  warningTime: number;
  criticalTime: number;
  startDate: string;
  stopDate: string;
  exception: any;
  creationDate: string;
  id: string;
}

export interface TestSuiteResult extends BaseResult {
  guid: string;
  browserName: string;
  browserInfo: string;
  host: string;
  dbJobPrimaryKey: string;
  testSuiteFolder: string;
  testSuiteFile: string;
  testCases: {[name:string]:TestCaseResult};
}

export interface TestCaseResult extends BaseResult {
  startUrl: string;
  lastUrl: string;
  steps: TestCaseStepResult[];
  testActions: TestActionResult[];
}

export interface TestActionResult {
  object: string;
  method: string;
  args: string[] | null;
  message: string;
  documentationURL: string;
}

export interface TestCaseStepResult extends BaseResult {
  errorScreenshot: string;
}
