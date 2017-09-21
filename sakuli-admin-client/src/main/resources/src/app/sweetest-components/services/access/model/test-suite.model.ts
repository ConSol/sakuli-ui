
export interface TestSuite<C = {}, TC extends TestCase<{}> = SimpleTestCase> {
  name: string;
  testCases: TC[];
  configurationFiles: string[];
  configuration: C;
  root: string;
}

export type SimpleTestSuite = TestSuite;

export interface TestCase<C = {}> {
  configuration: C,
  name: string;
  sourceFiles: string[],
  assetFiles: string[],
  configurationFiles: string []
}

export type SimpleTestCase = TestCase;

