import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'sa-help',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-question-circle"
        title="Help"
      ></sc-heading>
      <article class="d-flex flex-column">
        <div class="card p-3 mb-3">
          Find the complete documentation here: <a href="http://consol.github.io/sakuli/latest/index.html">http://consol.github.io/sakuli/latest/index.html</a>
        </div>
        <ng-container *ngIf="info$ | async; let info">
          
        </ng-container>
        <div class="card p-3">
          <div class="d-flex justify-content-center">
            <img src="assets/bmi_logo_eng.png"/>
          </div>
        </div>
        <div class="card p-3 justify-content-center">
          <span class="text-center">
            Made with ❤️ in Munich, Vienna, D&uuml;sseldorf and W&uuml;rzburg
          </span>
        </div>
      </article>
    </sc-content>
  `
})

export class SaHelpComponent implements OnInit {
  info$: Observable<any>;

  constructor(readonly http: HttpClient) {
  }

  ngOnInit() {
    this.info$ = this.http.get('/api/info');
  }
}
