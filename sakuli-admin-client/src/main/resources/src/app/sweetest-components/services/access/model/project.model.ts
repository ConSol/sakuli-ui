import {SimpleTestSuite, TestSuite} from './test-suite.model';

export interface ProjectModel<S extends TestSuite = SimpleTestSuite>{
  path: string;
  testSuite: S;
  name: string;
}
