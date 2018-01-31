import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Store, StoreModule} from "@ngrx/store";
import {marbles} from 'rxjs-marbles';
import {ScLoadingModule} from "./sc-loading.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {isLoading, LoadingSetBusy, LoadingSetIdle, ScLoadingState} from "./sc-loading.state";
import {ScLoadingDisplayAs} from "./sc-loading-display-as.interface";
import {ScLoadingPresentationComponent} from "./sc-loading-presentation.component";
import {notNull} from "../../../../core/redux.util";

type LoadingAppState = { scLoading: ScLoadingState };

describe('ScLoading', () => {

  describe('Component', () => {

    let fixture: ComponentFixture<ScLoadingPresentationComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          ScLoadingModule,
          NgbModule.forRoot(),
          StoreModule.forRoot({})
        ],

      }).compileComponents();
      fixture = TestBed.createComponent(ScLoadingPresentationComponent);
    });

    ([
      ['progressbar', true],
      ['progressbar', false],
      ['spinner', true],
      ['spinner', false],
    ] as ([ScLoadingDisplayAs, boolean])[]).forEach(([displayAs, show]) => {

      it(`should fullfill snapshot for ${displayAs} and show: ${show}`, () => {
        fixture.componentInstance.displayAs = displayAs;
        fixture.componentInstance.for = 'test';
        fixture.componentInstance.show = show;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
      })
    })

  });

  describe('state', () => {
    let store: Store<LoadingAppState>;

    beforeEach(async () => {
      await TestBed.configureTestingModule( {
        imports: [
          ScLoadingModule,
          StoreModule.forRoot({})
        ]
      }).compileComponents();
      store = TestBed.get(Store);
    });

    it('should set a state busy', marbles( (m) => {
      store.dispatch(new LoadingSetBusy('test'));
      const expected = m.cold('a', {a: true});
      const selection = store.select(isLoading('test')).filter(notNull);
      m.expect(selection).toBeObservable(expected);
    }))

    it('should set a state idle', marbles( (m) => {
      store.dispatch(new LoadingSetIdle('test'));
      const expected = m.cold('a', {a: false});
      const selection = store.select(isLoading('test')).filter(notNull);
      m.expect(selection).toBeObservable(expected);
    }))
  })


});
