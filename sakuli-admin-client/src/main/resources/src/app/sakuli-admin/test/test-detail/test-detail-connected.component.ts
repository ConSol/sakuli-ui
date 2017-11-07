import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {activeTest, openTests} from "../state/test.interface";
import {ActivatedRoute} from "@angular/router";
import {LoadTestsuite, testSuiteSelectors} from "../state/testsuite.state";
import {notNull} from "../../../core/redux.util";
import {CloseTest, OpenTest} from "../state/test.actions";
import {Observable} from "rxjs/Observable";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {NavigateToTestSuiteSource} from "../state/test-navitation.actions";
import {FormBaseComponent} from "../../../sweetest-components/components/forms/form-base-component.interface";
import {TestDetailComponent} from "./test-detail.component";
import {FormGroup} from "@angular/forms";

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

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
  ) {
    const [fileUrl$, noUrl$] = this.route.paramMap
      .map(p => p.get('file'))
      .partition(notNull);

    noUrl$
      .subscribe(_ => this.store.dispatch(new OpenTest('')));

    fileUrl$
      .map(decodeURIComponent)
      .subscribe(u => this.store.dispatch(new OpenTest(u)));

  }

  testSuite$: Observable<SakuliTestSuite> = this.route.paramMap
    .map(p => p.get('suite'))
    .map(decodeURIComponent)
    .mergeMap(s => this.store.select(testSuiteSelectors.byId(s)))
    .filter(notNull);
  tabs$         = this.store.select(openTests);
  activeTab$    = this.store.select(activeTest);
  testCase$     = this.testSuite$
    .withLatestFrom(this.activeTab$)
    .map(([suite, activeTab]) => {
      return suite.testCases.find(tc => `${tc.name}/${tc.mainFile}` === activeTab)
    });
  allTestCases$ = this.testSuite$.map(ts => ts.testCases);

  ngOnInit(): void {
    this.route.paramMap
      .map(m => m.get('suite'))
      .subscribe(suite => {
        this.store.dispatch(new LoadTestsuite(suite));
      })
  }

  onHomeSelect($event: NgbTabChangeEvent) {
    this.dispatchNavigation();
  }

  onTabClose(test: string) {
    this.store.dispatch(new CloseTest(test));
    this.dispatchNavigation(test)
  }

  onTabSelect($event: NgbTabChangeEvent) {
    this.dispatchNavigation($event.nextId)
  }

  onOpenCase(test: string) {
    this.dispatchNavigation(test);
  }

  dispatchNavigation(test?: string) {
    this.testSuite$.first().subscribe(ts => {
      this.store.dispatch(new NavigateToTestSuiteSource(ts, test));
    })
  }

  getForm(): FormGroup {
    return this.testDetailComponent.getForm();
  }
}
