import {Component, OnInit} from '@angular/core';
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {toastHistory} from "../../sweetest-components/components/presentation/toast/toast.reducer";

@Component({
  moduleId: module.id,
  selector: 'app-log',
  template: `
  `
})

export class AppLogComponent implements OnInit {
  constructor(
    readonly store: Store<AppState>
  ) {
  }

  get logsHistory() {
    return this.store.select(toastHistory);
  }

  ngOnInit() {
  }
}
