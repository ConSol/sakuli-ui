import {RouterGo} from "../../../sweetest-components/services/router/router.actions";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {testSuiteSelectId} from "./testsuite.state";

export class NavigateToTestSuiteSource extends RouterGo {
  constructor(
    readonly suite: SakuliTestSuite,
    readonly testCase?: string
  ) {
    super({path: [
      '/testsuite',
      encodeURIComponent(testSuiteSelectId(suite)),
      'sources',
      ...((testCase) ? [encodeURIComponent(testCase)] : [])
    ]})
  }
}
