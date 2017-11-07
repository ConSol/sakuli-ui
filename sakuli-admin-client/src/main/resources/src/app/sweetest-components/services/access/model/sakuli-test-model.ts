export interface SakuliTestCaseConfiguration {
  url: string;
}


export interface SakuliTestCase {
  configuration: SakuliTestCaseConfiguration,
  mainFile: string;
  startUrl: string;
  name: string;
  sourceFiles: string[],
  assetFiles: string[],
  configurationFiles: string []
};

export interface SakuliTestSuiteConfiguration {
  id: string,
  name: string
  warningTime: number,
  criticalTime: number,
  browser: string
  testSuiteFile: string;
  testPropertiesFile: string;
}


export interface SakuliTestSuite {
  id: string;
  name: string;
  testCases: SakuliTestCase[];
  configurationFiles: string[];
  configuration: SakuliTestSuiteConfiguration;
  root: string;
};


