import {Component, OnInit} from '@angular/core';
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {activeTest, allTestCases, openTests, testCase} from "../state/test.interface";

@Component({
  selector: 'test-detail-connected',
  template: `
    <sa-test-detail
      [tabs]="tabs$ |async"
      [activeTab]="activeTab$ | async"
      [testCase]="testCase$ | async"
      [allTestCases]="allTestCases$ | async"
    ></sa-test-detail>
  `
})
export class TestDetailConnectedComponent implements OnInit {
  constructor(
    private store: Store<AppState>
  ) {
  }

  tabs$         = this.store.select(openTests);
  activeTab$    = this.store.select(activeTest);
  testCase$     = this.store.select(testCase);
  allTestCases$ = this.store.select(allTestCases);

  ngOnInit() {

  }
}
