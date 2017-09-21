export interface BaseResult {
  name: string;
  resultState: string;
  resultCode: string;
  dbPrimaryKey: string;
  duration: number;
  warningTime: number;
  criticalTime: number;
  startTime: number;
  endTime: number;
}

export interface TestSuiteResult extends BaseResult{
  id: string;
  guid: string;
  browser: string;
  testCaseResults: TestCaseResult[];
}

export interface TestCaseResult extends BaseResult {
  startUrl: string;
  endUrl: string;
  stepResults: TestCaseStepResult[];
}

export interface TestCaseStepResult extends BaseResult {
  errorScreenshot: string;
}
