import {Injectable} from "@angular/core";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {notNull} from "../../core/redux.util";
import {Observable} from "rxjs/Observable";
import {TestState} from "../test/state/test.interface";

@Injectable()
export class DashboardService {

  private testState$: Observable<TestState> = this.store.select(s => s.test).filter(notNull);

  constructor(
    private store: Store<AppState>
  ) {}

  get testResults() {
    return this.testState$.map(s => s.testResults);
  }

  get latest$() {
    return this.testResults.map(tr => tr.find((_, i) => i === 0));
  }

}
