import {Component, Input, OnInit} from "@angular/core";
import {TestSuite} from "../../sweetest-components/services/access/model/test-suite.model";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {RunTest} from "./state/test.actions";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LogModalComponent} from "./test-detail/log-modal.component";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";

@Component({
  selector: 'run-test-suite',
  template: `
    <ul class="list-group margin-y">
      <li class="list-group-item d-flex justify-content-between">
        <div>
          <button [disabled]="!testSuite" class="btn btn-success" (click)="runSuite()">
            <sc-icon icon="fa-play-circle">Run</sc-icon>
          </button>
          <sc-loading for="runTest" displayAs="spinner">
            Preparing execution.
          </sc-loading>
        </div>
      </li>
    </ul>
  `
})
export class RunTestSuiteComponent implements OnInit{
  @Input() testSuite: TestSuite;

  constructor(
    private store: Store<AppState>,
    private modal: NgbModal
  ) {}

  ngOnInit() {
  }

  runSuite() {
    this.store.dispatch(new RunTest(this.testSuite as SakuliTestSuite));
  }

  openModal() {
    const cmpRef = this.modal.open(LogModalComponent);
  }
}
