import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule, SlicePipe} from '@angular/common';
import {ScIconComponent} from './components/presentation/icon/sc-icon.component';
import {ScLayoutComponent} from './components/layout/sc-layout.component';
import {ScHeadingComponent, ScHxComponent} from './components/presentation/text/sc-heading.component';
import {ScSidebarComponent} from './components/layout/sc-sidebar.component';
import {ScHeaderComponent} from './components/layout/sc-header.component';
import {ScContentComponent} from './components/layout/sc-content.component';
import {ScLinkComponent} from './components/layout/sc-link.component';
import {ScCircleIndicatorComponent} from './components/presentation/circle-indicator/sc-circle-indicator.component';
import {LayoutMenuService} from './components/layout/layout-menu.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from './services/access/project.service';
import {PrimaryContextDirective} from './components/common/context-states.directive';
import {ScCounterComponent} from './components/presentation/counter/sc-counter.component';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScTreeComponent} from './components/presentation/tree/sc-tree.component';
import {ScTreeItemComponent} from './components/presentation/tree/sc-tree-item.component';
import {TestService} from "./services/access/test.service";
import {ScTableComponent} from "./components/presentation/table/table.component";
import {ScEditorComponent} from "./components/presentation/editor/sc-editor.component";
import {FileService} from "./services/access/file.service";
import {FormsModule} from "@angular/forms";
import {StompService} from "./services/access/stomp.service";
import {ToastModule} from "./components/presentation/toast/toast.module";
import {AbsPathPipe, FileNamePipe, PathPipe} from "./components/common/file.pipes";
import {ScLogComponent} from "./components/presentation/log/log.component";
import {ScAccessModule} from "./services/access/access.module";
import {ScModalModule} from "./components/presentation/modal/sc-modal.module";
import {ScIconModule} from "./components/presentation/icon/sc-icon.module";
import {ScValuePickerModule} from "./components/presentation/value-picker/sc-value-picker.module";
import {UrlComponentPipe} from "./components/common/url-component.pipe";
import {ConcatPipe, SplitPipe} from "./components/common/util.pipes";
import {ScLoadingModule} from "./components/presentation/loading/sc-loading.module";
import {EntrySet, ScEntrySetPipe} from "./components/common/entry-set.pipe";


export const SweetestComponentsAndDirectives  = [
  ScLayoutComponent,
  ScHeadingComponent,
  ScSidebarComponent,
  ScHeaderComponent,
  ScContentComponent,
  ScLinkComponent,
  ScCircleIndicatorComponent,
  ScHxComponent,
  PrimaryContextDirective,
  ScCounterComponent,
  ScTreeComponent,
  ScTreeItemComponent,

  ScTableComponent,

  ScEditorComponent,

  FileNamePipe,
  PathPipe,
  UrlComponentPipe,
  AbsPathPipe,
  SplitPipe,
  ConcatPipe,

  ScEntrySetPipe,
  ScLogComponent,


];

export const Providers = [
  LayoutMenuService,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ScAccessModule,
    ToastModule,
    ScModalModule,
    ScValuePickerModule,
    ScIconModule,
    ScLoadingModule
  ],
  declarations: [
    ...(SweetestComponentsAndDirectives)
  ],
  exports: [
    ...(SweetestComponentsAndDirectives),
    NgbModule,
    FormsModule,
    ScAccessModule,
    ToastModule,
    ScModalModule,
    ScValuePickerModule,
    ScIconModule,
    ScLoadingModule
  ],
  providers: Providers
})
export class SweetestComponentsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SweetestComponentsModule,
      providers: Providers
    };
  }
}
