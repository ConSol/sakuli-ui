import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Theme} from "../theme";
import {IMenuItem} from "./menu/menu-item.interface";
import {AppState} from "../../../sakuli-admin/appstate.interface";
import {Store} from "@ngrx/store";
import {FontawesomeIcons} from "../presentation/icon/fontawesome-icon.utils";
import {workpaceSelectors} from "../../../sakuli-admin/workspace/state/project.interface";
import {NavigateToTestSuiteAssets} from "../../../sakuli-admin/test/state/test-navitation.actions";
import {testSuiteSelectors} from "../../../sakuli-admin/test/state/testsuite.state";
import {SakuliTestSuite} from "../../services/access/model/sakuli-test-model";
import {RouterGo} from "../../services/router/router.actions";
import {Router} from "@angular/router";
import {pinnedByContext} from "../../../sakuli-admin/test/sa-assets/sa-assets.interface";
import {ScModalService} from "../presentation/modal/sc-modal.service";
import {SaTextModalComponent} from "../../../sakuli-admin/test/sa-assets/sa-text-modal.component";
import {FileResponse} from "../../services/access/model/file-response.interface";
import {AssetsUnpin} from "../../../sakuli-admin/test/sa-assets/sa-assets.action";
import {testExecutionSelectors} from "../../../sakuli-admin/test/state/testexecution.state";
import {log} from "../../../core/redux.util";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-sidebar',
  template: `
    <ng-template #isRunning>
      <a
        class="run-button disabled ml-1 btn btn-sm rounded btn-primary"
        [ngbTooltip]="'Suite is running'"
        placement="right"
        container="body"
      >
        <sc-icon
          icon="fa-spinner"
          [spin]="true"
        ></sc-icon>
      </a>
    </ng-template>
    <ul class="nav flex-column">
      <ng-container *ngFor="let testSuite of testSuites$ | async">
        <sc-link [fixedIconWidth]="true"
                 icon="fa-cubes"
                 (click)="testSuiteItemClick(testSuite)"
                 [ngClass]="{'active': isActive(['/testsuite', testSuite.root])}"
        >
          <span class="hidden-md-down link-text">
            {{testSuite.id}}
          </span>
          <span class="actions mr-lg-0">
            <a
              class="run-button ml-1 btn btn-sm rounded btn-success"
              [ngbTooltip]="'Run ' + testSuite.id"
              placement="right"
              container="body"
              *ngIf="canRun$(testSuite) | async; else isRunning"
            >
              <sc-icon
                icon="fa-play"
                (click)="testSuiteItemClick(testSuite, {autorun:'1'}); $event.stopPropagation()"
              ></sc-icon>
            </a>
          </span>
        </sc-link>
        <ul *ngIf="isOpen(testSuite)">
          <sc-link *ngFor="let testCase of testSuite.testCases"
                   [fixedIconWidth]="true"
                   icon="fa-code"
                   [routerLink]="['/testsuite', testSuite.root, 'sources', [testCase.name, testCase.mainFile].join('/')]"
                   [ngClass]="{'active': isActive(['/testsuite', testSuite.root, 'sources', [testCase.name, testCase.mainFile].join('/')])}"
          >
            <span class="hidden-xs-down link-text">{{testCase.name}}</span>
          </sc-link>
          <sc-link [fixedIconWidth]="true"
                   [routerLink]="['/testsuite', testSuite.root, 'assets']"
                   [ngClass]="{'active': isActive(['/testsuite', testSuite.root, 'assets'])}"
                   icon="fa-files-o"
          >
            <span class="hidden-xs-down link-text">Files</span>
          </sc-link>
          <sc-link [fixedIconWidth]="true"
                   *ngFor="let pinned of getPinnedFiles$(testSuite.root) | async"
                   (click)="openFile(pinned.file)"
                   icon="fa-file-o"
                   class="d-flex justify-content-between"
          >
            <span class="hidden-xs-down link-text">{{pinned.file.name}}</span>
            <button type="button"
                    class="close"
                    (click)="unPin($event, pinned.file, testSuite)"
                    data-dismiss="alert"
                    aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </sc-link>
          <sc-link [fixedIconWidth]="true"
                   [routerLink]="['/testsuite', testSuite.root, 'configuration']"
                   [ngClass]="{'active': isActive(['/testsuite', testSuite.root, 'configuration'])}"
                   icon="fa-wrench"
          >
            <span class="hidden-xs-down link-text">Configuration</span>
          </sc-link>
        </ul>
      </ng-container>
      <sc-link [fixedIconWidth]="true"
               icon="fa-files-o"
               *ngIf="workspace$ | async"
               (click)="navigateToWorkspaceAssets()"
      >
        Files
      </sc-link>
      <sc-link [fixedIconWidth]="true"
               *ngFor="let pinned of getPinnedFiles$(workspace$ | async) | async"
               (click)="openFile(pinned.file)"
               icon="fa-file-o"
               class="d-flex justify-content-between"
      >
        <span class="hidden-xs-down link-text">{{pinned.file.name}}</span>
        <button type="button"
                class="close"
                (click)="unPin($event, pinned.file)"
                data-dismiss="alert"
                aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </sc-link>
    </ul>
  `,
  styles: [`
    sc-link.main {
      width: 100%;
    }

    :host {
      background-color: ${Theme.colors.secondary};
      color: #374d85;
      padding: 0;
      overflow-y: auto;
      max-height: calc(100vh - 62px);
    }

    :host /deep/ sc-link, .sc-link {
      height: 4rem;
      border-bottom: 1px solid #dae6f3;
      display: flex;
    }

    :host /deep/ sc-link {
      justify-content: flex-start;
      align-items: center;
    }

    :host /deep/ sc-link:hover {
      background-color: #e3effc;
    }

    .link-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ul ul {
      padding-left: 0;
    }

    ul ul sc-link {
      padding-left: 25px;
      padding-top: 0;
      padding-bottom: 0;
      height: auto;
    }

    .run-button {
      color: white !important;
    }
    
    sc-link.active {
      background-color: #e3effc;
    }

  `]
})
export class ScSidebarComponent {

  private selectionMap = new Map<string, boolean>();

  icons = FontawesomeIcons;

  @Input() menuItems: IMenuItem[];

  @Output() menuItemSelected = new EventEmitter<IMenuItem>();

  workspace$ = this.store.select(workpaceSelectors.workspace);

  testSuites$ = this.store.select(testSuiteSelectors.selectAll);

  @HostBinding('class')
  get hostClass() {
    return 'col-1 col-sm-3 flex';
  }

  constructor(
    readonly store: Store<AppState>,
    readonly router: Router,
    readonly modal: ScModalService
  ) {}

  getPinnedFiles$(context:string) {
    return this.store.select(pinnedByContext(context));
  }

  isOpen(item: SakuliTestSuite) {
    return this.selectionMap.get(item.root);
  }

  navigateToWorkspaceAssets() {
    this.workspace$.first()
      .subscribe(ws => {
        this.store.dispatch(new NavigateToTestSuiteAssets(ws))
      })
  }

  openFile(file: FileResponse) {
    this.modal.open(SaTextModalComponent, {file})
  }

  testSuiteItemClick(testSuite: SakuliTestSuite, query: any) {
    const path = ['/testsuite', testSuite.root];
    this.store.dispatch(new RouterGo({path, query}));
    this.selectionMap.set(testSuite.root, !this.selectionMap.get(testSuite.root));
  }

  isActive(path: any[]) {
    const tree = this.router.createUrlTree(path);
    return this.router.isActive(tree, false);
  }

  unPin($event: MouseEvent, file: FileResponse, testSuite?: SakuliTestSuite) {
    $event.stopPropagation();
    if(testSuite) {
      this.store.dispatch(new AssetsUnpin(file, testSuite.root));
    } else {
      this.workspace$.first().subscribe(ws => this.store.dispatch(new AssetsUnpin(file, ws)))
    }
  }

  canRun$(testSuite: SakuliTestSuite) {
    return this.store.select(testExecutionSelectors.latestByTestSuite(testSuite))
      .do(log(testSuite.id))
      .map(i => i == null ? true : !i.isRunning)
  }
}
