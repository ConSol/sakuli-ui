import {SakuliTestSuite} from "./sakuli-test-model";

export interface ProjectModel{
  path: string;
  testSuite: SakuliTestSuite;
  name: string;
}
