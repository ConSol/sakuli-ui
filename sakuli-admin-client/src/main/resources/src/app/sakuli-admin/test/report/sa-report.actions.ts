import {RouterGo} from "../../../sweetest-components/services/router/router.actions";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";

export class NavigateToReportsOverview extends RouterGo {
  constructor() {
    super({path: ['/reports']})
  }
}

export class NavigateToResultReport extends RouterGo {
  constructor(result: TestSuiteResult) {
    super({path: ['/reports', result.sourceFile]})
  }
}
