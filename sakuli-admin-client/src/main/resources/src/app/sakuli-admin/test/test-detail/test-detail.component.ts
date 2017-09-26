import {Component, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {CloseTest, OpenTest} from "../state/test.actions";
import {AppState} from "../../appstate.interface";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {TestCase} from "../../../sweetest-components/services/access/model/test-suite.model";
import {log, notNull} from "../../../core/redux.util";

@Component({
  selector: 'sa-test-detail',
  template: `
    <sc-content>
      <article class="d-flex flex-column">
        <ngb-tabset style="flex-grow: 1"
                    class=""
                    (tabChange)="onTabChange($event)"
                    [activeId]="activeTab">
          <ngb-tab [id]="fileTabId">
            <ng-template ngbTabTitle class="d-flex justify-content-between">
              <sc-icon icon="fa-files-o"></sc-icon>
            </ng-template>
            <ng-template ngbTabContent class="test-cnt">
              <ul class="list-group margin-y">
                <li class="list-group-item" *ngFor="let case of allTestCases">
                  <sc-link [routerLink]="['/test', 'sources', case | urlComponent ]" icon="fa-code">{{case | fileName}}</sc-link>
                </li>
              </ul>
            </ng-template>
          </ngb-tab>
          <ngb-tab
            *ngFor="let tab of tabs"
            [id]="tab"
          >
            <ng-template ngbTabTitle class="d-flex justify-content-between">
              <span>{{tab}}</span>
              <a (click)="onCloseTab($event, tab)">&times;</a>
            </ng-template>
            <ng-template ngbTabContent class="test-cnt">
              <sa-source [testCase]="testCase" class="d-flex"></sa-source>
            </ng-template>
          </ngb-tab>
        </ngb-tabset>
      </article>
    </sc-content>
  `,
  styles: [`
    ngb-tabset {
      flex-grow: 1;
      flex-direction: column;
      display: flex;
    }

    :host /deep/ .tab-content {
      flex-grow: 1;
      flex-direction: column;
      display: flex;
    }

    :host /deep/ .tab-pane {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      height: 100%;
    }

    sa-test-detail-editor {
      flex-grow: 1;
    }
    
    sa-source {
      flex-grow: 1;
    }
  `]
})
export class TestDetailComponent {

  fileTabId = 'test-detail-component-item-tab-id';
  @Input() tabs: string[] = [];
  @Input() activeTab: string = this.fileTabId;
  @Input() testCase: TestCase = null;
  @Input() allTestCases: TestCase[] = [];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
              ) {
    /** TODO: Extract Effects for routing **/
    const [fileUrl$, noUrl$] =this.route.paramMap
      .map(p => p.get('file'))
      .partition(notNull)

      noUrl$
        .subscribe(_ => this.store.dispatch(new OpenTest('')))

      fileUrl$
        .map(decodeURIComponent)
        .do(log('sddfgdfg'))
        .subscribe(u => this.store.dispatch(new OpenTest(u)));

  }

  onTabChange($event: NgbTabChangeEvent) {
    if($event.nextId !== this.fileTabId) {
      this.router.navigate(['/test', 'sources', $event.nextId]);
    } else {
      this.router.navigate(['/test', 'sources'])
    }
  }

  onCloseTab($event: MouseEvent, test: string) {
    $event.preventDefault();
    this.store.dispatch(new CloseTest(test))
    this.router.navigate(['/test', 'sources'])
  }

  case2Url(testCase: TestCase) {
    return encodeURIComponent(testCase.name);
  }

}
