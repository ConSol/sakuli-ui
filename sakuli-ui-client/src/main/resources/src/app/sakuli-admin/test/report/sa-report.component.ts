import {Component, OnInit} from '@angular/core';
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {testResults} from "../state/test.interface";
import {LoadTestResults} from "../state/test.actions";
import {BoundIndexIterator} from "../../../sweetest-components/utils";
import {ActivatedRoute} from "@angular/router";
import {NavigateToResultReport} from "./sa-report.actions";
import {animate, group, query, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'sa-report',
  animations: [
    trigger('pageTurn', [
      transition(':increment', group([
        query(':enter', [
          style({transform: 'translateX(100%)'}),
          animate('.5s ease-out', style('*'))
        ]),
        query(':leave', [
          style({transform: 'translateY(-105%)', boxShadow: 'none'}),
          animate('.5s ease-out', style({transform: 'translateX(-100%) translateY(-105%)', boxShadow: 'none'}))
        ])
      ])),
      transition(':decrement', group([
        query(':enter', [
          style({transform: 'translateX(-100%)'}),
          animate('.5s ease-out', style('*'))
        ]),
        query(':leave', [
          style({transform: 'translateY(-105%)', boxShadow: 'none'}),
          animate('.5s ease-out', style({transform: 'translateX(100%) translateY(-105%)', boxShadow: 'none'}))
        ])
      ]))
    ])
  ],
  template: `
    <sc-content>
      <article class="d-flex flex-column">
        <sc-loading displayAs="progressbar" for="loadingTestResults"></sc-loading>
        <sa-report-navigation [testResult]="currentResult$ | async"
                              (next)="next()"
                              (prev)="prev()"
                              [navigation]="true"
        ></sa-report-navigation>
        <div class="paging-wrapper">
          <div class="d-flex align-items-start flex-nowrap">
            <sa-report-content
              [@pageTurn]="index"
              [testResult]="currentResult$ | async"
            ></sa-report-content>
          </div>
        </div>
      </article>
    </sc-content>
  `,
  styles: [`
    .paging-wrapper {
      overflow-y: auto;
      overflow-x: hidden;
    }

    sa-report-content {
      width: 100%;
      float: left;
    }
  `]
})
export class SaReportComponent implements OnInit {

  indexIterator: BoundIndexIterator = new BoundIndexIterator(0, 0);

  index = 0;

  constructor(readonly store: Store<AppState>,
              readonly route: ActivatedRoute) {
  }

  prev() {
    this.navigate(-1);
  }


  next() {
    this.navigate(+1);
  }

  private navigate(offSet: number) {
    this.index += offSet;
    return this
      .testResults$
      .combineLatest(this.route.paramMap.filter(m => m.has('report')).map(m => m.get('report')).first())
      .map(([trs, pReport]) => {
        const i = trs.findIndex(tr => tr.sourceFile === pReport);
        const it = new BoundIndexIterator(trs.length, i);
        const ni = offSet < 0 ? it.prev() : it.next();
        return trs[ni];
      })
      .first()
      .subscribe(tr => {
        this.store.dispatch(new NavigateToResultReport(tr))
      })
  }

  get testResults$() {
    return this.store.select(testResults);
  }

  get currentResult$() {
    return this
      .testResults$
      .combineLatest(this.route.paramMap.filter(m => m.has('report')).map(m => m.get('report')))
      .map(([trs, pReport]) => trs.find(tr => tr.sourceFile === pReport));
  }

  ngOnInit() {
    const [withEntries, withoutEntries] = this.testResults$.partition(tr => !!tr.length);
    withEntries
      .first()
      .subscribe(tr => this.indexIterator = new BoundIndexIterator(tr.length, this.index));

    withoutEntries
      .first()
      .subscribe(tr => this.store.dispatch(new LoadTestResults()));
  }

}
