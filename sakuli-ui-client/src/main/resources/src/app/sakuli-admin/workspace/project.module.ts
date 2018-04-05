import {NgModule} from '@angular/core';
import {ProjectOpenComponent} from './project-open.component';
import {CommonModule} from '@angular/common';
import {SweetestComponentsModule} from '../../sweetest-components';
import {StoreModule} from '@ngrx/store';
import {workspaceReducer} from './state/project.reducer';
import {EffectsModule} from "@ngrx/effects";
import {ProjectEffects} from "./state/projects.effects";
import {WorkspaceFeatureName} from "./state/project.interface";

export const DeclareAndExport = [
  ProjectOpenComponent
];

@NgModule({
  imports: [
    CommonModule,
    SweetestComponentsModule,
    StoreModule.forFeature(WorkspaceFeatureName, workspaceReducer),
    EffectsModule.forFeature([ProjectEffects]),
  ],
  entryComponents: [
    ProjectOpenComponent
  ],
  providers: [
    ProjectEffects
  ],
  declarations: [
    ...DeclareAndExport
  ],
  exports: [
    ...DeclareAndExport
  ]
})
export class ProjectModule {}
