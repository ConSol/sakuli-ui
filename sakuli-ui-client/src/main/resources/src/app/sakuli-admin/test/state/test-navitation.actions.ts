import {RouterGo} from "../../../sweetest-components/services/router/router.actions";
import {SakuliTestCase, SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {testSuiteSelectId} from "./testsuite.state";


export class NavigateToTestSuite extends RouterGo {
  constructor(readonly suite: SakuliTestSuite,
              readonly autorun: boolean = false) {
    super({
      path: ['/testsuite'],
      query: {
        suite: testSuiteSelectId(suite),
        autorun
      }
    });
  }
}


export class NavigateToTestSuiteSource extends RouterGo {
  constructor(readonly suite: SakuliTestSuite | string,
              readonly testCase: SakuliTestCase | string) {
    super({
      path: [
        '/testsuite',
        'sources',
      ],
      query: {
        suite: typeof suite === 'string' ? suite : testSuiteSelectId(suite),
        file: typeof testCase === 'string' ? testCase : [testCase.name, testCase.mainFile].join('/')
      }
    })
  }
}

export class NavigateToTestSuiteConfiguration extends RouterGo {
  constructor(
    readonly testsuite: SakuliTestSuite
  ) {
    super({
      path: ['/testsuite', 'configuration'],
      query: {
        suite: testSuiteSelectId(testsuite)
      }
    })
  }
}

export class NavigateToTestSuiteAssets extends RouterGo {
  constructor(readonly suite: SakuliTestSuite | string,
              readonly asset?: string) {
    super({
      path: [
        '/testsuite',
        'assets'
      ],
      query: {
        suite: ((typeof suite === 'string') ? suite : testSuiteSelectId(suite)),
        file: asset
      }
    })
  }
}
