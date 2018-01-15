import {RouterGo} from "../../sweetest-components/services/router/router.actions";

export class NavigateToDashboard extends RouterGo {
  constructor() {
    super({path: ['/dashboard']})
  }
}
