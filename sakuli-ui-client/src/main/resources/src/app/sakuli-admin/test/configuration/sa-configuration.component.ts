import {Component, HostListener, Input, OnInit} from '@angular/core';
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {ActivatedRoute} from "@angular/router";
import {LoadTestsuite} from "../state/testsuite.state";
import {FormBaseComponent} from "../../../sweetest-components/components/forms/form-base-component.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DangerToast, SuccessToast} from "../../../sweetest-components/components/presentation/toast/toast.model";

@Component({
  moduleId: module.id,
  selector: 'sa-configuration',
  template: `
    <sc-content>
      <sc-heading
        [title]="'Configuration'"
        [subTitle]=""
        icon="fa-wrench"
      >
        <a
          href="https://github.com/ConSol/sakuli/blob/master/src/common/src/main/resources/org/sakuli/common/config/sakuli-default.properties"
          target="_blank">
          <sc-icon
            icon="fa-question-circle"
            ngbTooltip="Show default properties"
            placement="left"
            container="body"
          ></sc-icon>
        </a>
      </sc-heading>
      <article class="no-gutter d-flex">
        <ng-template #loading>
          <ngb-progressbar class="d-flex"></ngb-progressbar>
        </ng-template>
        <form *ngIf="form; else loading" [formGroup]="form" class="d-flex" style="flex-grow: 1">
          <sc-editor formControlName="source" mode="properties">
            <nav class="navbar bottom d-flex flex-row justify-content-end">
              <button 
                class="btn btn-success"
                [disabled]="isSaveDisabled"
                (click)="onSave()">Save</button>
            </nav>
          </sc-editor>
        </form>
      </article>
    </sc-content>
  `
})

export class SaConfigurationComponent implements OnInit, FormBaseComponent {
  getForm(): FormGroup {
    return this.form;
  }

  @Input() currentFile;

  form: FormGroup;

  @HostListener('document:keydown', ['$event'])
  onHostKeydown($event: KeyboardEvent) {
    if (($event.key == 's' || $event.key == 'S' ) && ($event.ctrlKey || $event.metaKey)) {
      $event.preventDefault();
      this.onSave();
      return false;
    }
    return true;
  }

  constructor(readonly fileService: FileService,
              readonly store: Store<AppState>,
              readonly toastService: ScToastService,
              readonly route: ActivatedRoute,
              readonly fb: FormBuilder
              ) {
  }

  initForm(value: string) {
    if(this.form) {
      this.form.setValue({'source': value})
    } else {
      this.form = this.fb.group({
        'source': [value]
      })
    }
    this.form.markAsPristine();
  }

  get isSaveDisabled() {
    return this.form.pristine;
  }

  ngOnInit() {
    this.refresh();
  }

  get path$() {
    return this.route.queryParamMap.map(m => {
      return m.has('suite') ? decodeURIComponent(m.get('suite')) : '';
    })
  }

  refresh() {
    this.path$
      .mergeMap(p => this.fileService.read(`${p}/testsuite.properties`))
      .subscribe(r => {
        this.initForm(r);
      }, e => {
        this.toastService.create(new DangerToast('Error while loading', e))
      })
  }

  onSave() {
    this.path$.mergeMap(p => {
      return this.fileService.write(
        p,
        new File([this.form.get('source').value], 'testsuite.properties')
      )
        .mapTo(p);
    })
      .subscribe(path => {
        this.toastService.create(new SuccessToast(`Successfully saved configuration ${path}`));
        this.store.dispatch(new LoadTestsuite(path));
        this.refresh();
      }, e => {
        this.toastService.create(new DangerToast('Error while saving configuration', e))
      })
  }
}
