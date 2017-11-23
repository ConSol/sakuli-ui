import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {SakuliTestCase, SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {FormBaseComponent} from "../../../sweetest-components/components/forms/form-base-component.interface";
import {SaSourceComponent} from "./tabs/source.component";
import {FormGroup} from "@angular/forms";
import {TestEditorEntity} from "../state/test-editor.interface";

@Component({
  selector: 'sa-test-detail',
  template: `
    <sc-content>
      <article class="d-flex flex-column">
        <ngb-tabset style="flex-grow: 1"
                    class=""
                    (tabChange)="onTabChange($event)"
                    [activeId]="activeTab">
          <ngb-tab [id]="fileTabId" (click)="onTabChange()">
            <ng-template ngbTabTitle class="d-flex justify-content-between">
              <sc-icon icon="fa-files-o"></sc-icon>
            </ng-template>
            <ng-template ngbTabContent class="test-cnt">
              <ng-container *ngFor="let testCase of allTestCases">
                <h4>{{testCase.name}}</h4>
                <ul class="list-group margin-y">
                  <li class="list-group-item" *ngFor="let testCase of testCasesGrouped[tcName]">
                    <sc-link
                      (click)="navigateTo(testCase)"
                      icon="fa-code">{{testCase.name}}
                    </sc-link>
                  </li>
                </ul>
              </ng-container>
            </ng-template>
          </ngb-tab>
          <ngb-tab
            *ngFor="let tab of tabs"
            [id]="tab.id"
          >
            <ng-template ngbTabTitle class="d-flex justify-content-between">
              <span class="text-overflow-ellipsis"
                    [ngbTooltip]="tab.testCase"
                    container="body"
              >{{tab.testCase}}</span>
              <a (click)="onCloseTab($event, tab)" class="ml-1">&times;</a>
            </ng-template>
            <ng-template ngbTabContent class="test-cnt">
              <sa-source
                [testSuite]="testSuite"
                [testCase]="testCase"
                class="d-flex flex-column"
                *ngIf="testCase && testCase; else loading"
                #sourceEditor
              >
              </sa-source>
              <ng-template #loading>
                <ngb-progressbar
                  class="d-flex"
                >
                </ngb-progressbar>
              </ng-template>
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

    :host /deep/ ul.nav-tabs {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
    }
    
    :host /deep/ .nav-item {
      width: auto;
    }
    
    :host /deep/ .nav-item a.nav-link > span {
      direction: rtl;
    }
    
    :host /deep/ .nav-item a.nav-link {
      display: flex;
      max-width: 8rem;
    }
    
    :host /deep/ .nav-item a.nav-link.active {
      display: flex;
      max-width: inherit;
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
export class TestDetailComponent implements FormBaseComponent {
  @ViewChild(SaSourceComponent)
  sourceEditor: SaSourceComponent;

  fileTabId = 'test-detail-component-item-tab-id';
  @Input() testSuite: SakuliTestSuite;
  @Input() tabs: TestEditorEntity[] = [];
  @Input() activeTab: string = this.fileTabId;
  @Input() testCase: SakuliTestCase = null;
  @Input() allTestCases: SakuliTestCase[] = [];

  @Output() testSelect = new EventEmitter<TestEditorEntity>();
  @Output() homeSelect = new EventEmitter<TestEditorEntity>();
  @Output() tabClose = new EventEmitter<string>();
  @Output() openCase = new EventEmitter<string>();

  onTabChange($event: NgbTabChangeEvent) {
    const entity = this.tabs.find(t => t.id === $event.nextId);
    if (entity && $event.nextId !== this.fileTabId) {
      this.testSelect.next(entity);
    } else {
      //this.homeSelect.next($event);
    }
  }

  onCloseTab($event: MouseEvent, test: string) {
    $event.preventDefault();
    this.tabClose.next(test);
  }

  navigateTo(testCase: SakuliTestCase) {
    this.openCase.next([testCase.name, testCase.mainFile].join('/'));
  }

  get testCaseGroupNames() {
    return Object.keys(this.testCasesGrouped);
  }

  get testCasesGrouped() {
    return this.allTestCases.reduce((all, tc) => {
      const tcs = [...(all[tc.name] || []), tc];
      return {...all, [tc.name]: tcs}
    }, {});
  }

  getForm() {
    if(this.sourceEditor) {
      return this.sourceEditor.getForm();
    } else {
      return new FormGroup({});
    }
  }
}
