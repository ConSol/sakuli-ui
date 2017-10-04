import {ComponentFixture, TestBed} from "@angular/core/testing";
import {NgrxUtilModule} from "./ngrx-util.module";
import {Action, createSelector, MemoizedSelector, Store, StoreModule} from "@ngrx/store";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ConnectComponent} from "./connect";

xdescribe('connect', () => {

  const Actions = {
    INC: {type: '[spec] inc'},
    DEC: {type: '[spec] dec'}
  };

  function specReducer(state:number = 0, action: Action) {
    switch (action.type) {
      case Actions.DEC.type: {
        return state - 1;
      }
      case Actions.INC.type: {
        return state + 1;
      }
    }
    return state || 0;
  }

  @Component({
    selector:'counter',
    template: `
      <div>{{count}}</div>
      <button name="inc" (click)="onIncrement()">+</button>
      <button name="dec" (click)="onDecrement()">-</button> 
    `
  })
  class CounterComponent {
    @Input() count: number = 0;
    @Output() increment = new EventEmitter<number>();

    @Output() decrement = new EventEmitter<number>();

    onIncrement() { this.increment.next()}
    onDecrement() { this.decrement.next()}
  }

  const selectCount: MemoizedSelector<{counter:number}, number> = createSelector(
    (s: {counter:number}) => s.counter,
    (s:number) => s
  );

  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let store: Store<{count:number}>;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({counter: specReducer}, {initialState: {counter: 0}}),
        NgrxUtilModule.forRoot([
          ConnectComponent<any, CounterComponent>({
            count: selectCount,
          }, {
            decrement: _ => Actions.DEC,
            increment: _ => Actions.INC,
          })(CounterComponent)
        ]),
      ],
      declarations: [CounterComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should update counter', () => {
    console.log('Test1');
    expect(component.count).toBe(0);
    store.dispatch(Actions.INC);
    fixture.detectChanges();
    expect(component.count).toBe(1);
  });

  it('should update counter', () => {
    console.log('Test2');
    expect(component.count).toBe(0);
    store.dispatch(Actions.DEC);
    store.dispatch(Actions.DEC);
    store.dispatch(Actions.INC);
    store.dispatch(Actions.DEC);
    fixture.detectChanges();
    expect(component.count).toBe(-2);
  });

  it('should dispatch, as EventEmitter fires with module config', () => {
    console.log('Test3');
    component.onIncrement();
    component.onDecrement();
    component.onIncrement();
    fixture.detectChanges();
    expect(component.count).toBe(1);
  });

  it('should dispatch, as EventEmitter fires with decorator', () => {
    console.log('Test4');
    component.onDecrement();
    fixture.detectChanges();
    expect(component.count).toBe(-1);
  })
});
