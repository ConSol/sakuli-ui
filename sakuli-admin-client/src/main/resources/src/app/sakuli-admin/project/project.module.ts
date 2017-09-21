import {NgModule} from '@angular/core';
import {ProjectOpenComponent } from './project-open.component';
import {CommonModule} from '@angular/common';
import {SweetestComponentsModule} from '../../sweetest-components/index';
import {StoreModule} from '@ngrx/store';
import {projectReducer} from './state/project.reducer';
import {EffectsModule} from "@ngrx/effects";
import {ProjectEffects} from "./state/projects.effects";

export const DeclareAndExport = [
  ProjectOpenComponent
];

@NgModule({
  imports: [
    CommonModule,
    SweetestComponentsModule,
    EffectsModule.forFeature([ProjectEffects]),
    StoreModule.forFeature('project', projectReducer),
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
