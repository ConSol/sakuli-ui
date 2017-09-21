import {TestCase, TestSuite} from './test-suite.model';

export interface SakuliTestCaseConfiguration {
  url: string;
}


export interface SakuliTestCase extends TestCase<SakuliTestCaseConfiguration> {};

export interface SakuliTestSuiteConfiguration {
  id: string,
  name: string
  warningTime: number,
  criticalTime: number,
  browser: string
  testSuiteFile: string;
  testPropertiesFile: string;
}


export interface SakuliTestSuite extends TestSuite<SakuliTestSuiteConfiguration, SakuliTestCase> {};


