import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../../appstate.interface";
import {createSelector, Store} from "@ngrx/store";
import {activeTest, openTests} from "../state/test.interface";
import {ActivatedRoute} from "@angular/router";
import {LoadTestsuite, testSuiteSelectors} from "../state/testsuite.state";
import {notNull} from "../../../core/redux.util";
import {Observable} from "rxjs/Observable";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {NavigateToTestSuiteSource} from "../state/test-navitation.actions";
import {FormBaseComponent} from "../../../sweetest-components/components/forms/form-base-component.interface";
import {TestDetailComponent} from "./test-detail.component";
import {FormGroup} from "@angular/forms";
import {
  CloseTest, OpenTest, ResetSelectedTestcase, TestEditorEntity,
  testEditorSelectors
} from "../state/test-editor.interface";
import {nothrowFn} from "../../../core/utils";

@Component({
  selector: 'test-detail-connected',
  template: `
    <sa-test-detail
      [tabs]="tabs$ |async"
      [activeTab]="activeTab$ | async"
      [testCase]="testCase$ | async"
      [allTestCases]="allTestCases$ | async"
      [testSuite]="testSuite$ | async"

      (homeSelect)="onHomeSelect($event)"
      (tabClose)="onTabClose($event)"
      (testSelect)="onTabSelect($event)"
      (openCase)="onOpenCase($event)"
      #testDetailComponent
    ></sa-test-detail>
  `
})
export class TestDetailConnectedComponent implements OnInit, FormBaseComponent {

  @ViewChild(TestDetailComponent)
  testDetailComponent: TestDetailComponent;

  tabs$ = this.store.select(testEditorSelectors.selectAll);
  activeTab$ = this.store.select(testEditorSelectors.selectedId);
  testCase$ = this.store.select(testEditorSelectors.selectedTestCase);
  allTestCases$ = this.store.select(createSelector(
    testEditorSelectors.selectedTestSuite,
    nothrowFn(ts => ts.testCases, [])
  ));
  testSuite$ = this.store.select(testEditorSelectors.selectedTestSuite);

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,) {

  }

  ngOnInit(): void {
    this.route.params
      .map(p => {
        const {file, suite} = p;
        if (file && suite) {
          return new OpenTest(suite, file);
        } else {
          return new ResetSelectedTestcase();
        }
      })
      .subscribe(a => this.store.dispatch(a));

    this.tabs$.subscribe(s => console.log('tabs', s));
    this.activeTab$.subscribe(s => console.log('activetabs', s));
    this.testCase$.subscribe(s => console.log('testcase', s));
    this.allTestCases$.subscribe(s => console.log('all cases', s));
    this.testSuite$.subscribe(s => console.log('all cases', s));
  }

  onHomeSelect($event: NgbTabChangeEvent) {
    //this.store.dispatch(new NavigateToTestSuiteSource(e.testSuite));
  }

  onTabClose(test: TestEditorEntity) {
    this.store.dispatch(new CloseTest(test.id));
    this.dispatchNavigation(test)
  }

  onTabSelect($event: TestEditorEntity) {
    this.store.dispatch(new NavigateToTestSuiteSource($event.testSuite, $event.testCase));
  }

  onOpenCase(test: string) {
    //this.dispatchNavigation(test);
  }

  dispatchNavigation(e?: TestEditorEntity) {
    if(e) {

    } else {

    }
  }

  getForm(): FormGroup {
    return this.testDetailComponent.getForm();
  }
}
