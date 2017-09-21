import {$concat, $filter, $merge, $pipe, $push, set, StateUpdate, stateUpdateReducer, UpdateCommand} from "./update";

interface AMap {
  [key:string]:string;
}

interface That {
  beautiful?: boolean,
  real?: {
    life: boolean
  },
  aMap: AMap
}

interface State {
  is: {
    that: That
    tasty?: string[]
  }
}

describe("ngrx-util/update", () => {

  const state: State = {
    is:
      {
        that:
          {
            aMap: {
              "i": "am",
              "not": "sure"
            },
            real:
              {life: true}
          },
        tasty: []
      },
  };

  describe('set', () => {

    it('should set a value', () => {
      set(state, 'is', 'that', 'real', 'life')(false);
      expect(state.is.that.real.life).toBe(false);
    })
  });

  describe('update action', () => {

    it('', () => {
      const action = new StateUpdate<State>({
        is: {
          that: $merge({
            beautiful: true,
            aMap: $merge({me: 'either'}),
          }),
          tasty: $pipe(
            $push('Vegetables'),
            $concat(['Pizza', 'Burger', 'Beer']),
            $filter(i => i !== 'Vegetables')
          )
        }
      });
      const state_1 = stateUpdateReducer(state, action);
      expect(state_1.is.that.beautiful).toBeTruthy();
      expect(state_1.is.tasty).toEqual(['Pizza', 'Burger', 'Beer']);
      expect(Object.keys(state_1.is.that.aMap).length).toBe(3);

    })

  });

})
