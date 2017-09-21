import {EventEmitter, Inject, NgModule, NgZone, Type} from "@angular/core";
import {Action, Store} from "@ngrx/store";
import {
  ActionEmitter,
  CONNECTED_COMPONENT_INPUT_METADATA_KEY,
  CONNECTED_COMPONENT_METADATA_KEY, CONNECTED_COMPONENT_OUTPUT_METADATA_KEY, ConnectedInputOutput, InputToSelectorMap,
  Select,
} from "./connect";
import {
  ACTION_CREATOR_METADATA_KEY, ActionCreatorConfig, actionTypeFor,
  AsyncActionLifecycle
} from "./action-creator-metadata";
import {Observable} from "rxjs";
import {isPromiseLike} from "./utils";
import {UTILIZED_ROOT} from "./di-tokens";
import {Subject} from "rxjs/Subject";

const r: any = Reflect;

@NgModule({})
export class NgrxUtilRootModule {

  utilizedClasses:Type<any>[] = [];

  constructor(
    private store: Store<any>,
    @Inject(UTILIZED_ROOT) private utilized: Type<any>[],
    private zone: NgZone
  ) {
    (utilized || []).forEach((serviceInstance:Type<any>) => {
      this.addUtilizedClass(serviceInstance);
    })
  }

  addUtilizedClass(serviceInstance:Type<any>) {

    this.utilizedClasses.push(serviceInstance);
    const prototype = Object.getPrototypeOf(serviceInstance);

    const constructorMeta = r.getMetadata(CONNECTED_COMPONENT_METADATA_KEY, prototype.constructor) as ConnectedInputOutput<any, any>;

    if(constructorMeta && constructorMeta.inputs) {
      Object.keys(constructorMeta.inputs).forEach(key => {
        Select(constructorMeta.inputs[key])(prototype, key);
      })
    }

    /** Apply @Select **/
    Object.getOwnPropertyNames(serviceInstance).forEach(key => {
      const selectorAndSubject = r.getMetadata(CONNECTED_COMPONENT_INPUT_METADATA_KEY, serviceInstance, key) as InputToSelectorMap<any, any>;
      if(selectorAndSubject) {
        return this.store
          .select(selectorAndSubject.selector)
          .distinctUntilChanged()
          .subscribe(v => {
            this.zone.run(() => {
              selectorAndSubject.value.next(v)
            })
          });
      }
    });

    if(constructorMeta && constructorMeta.outputs) {
      Object.keys(constructorMeta.outputs).forEach(key => {
        ActionEmitter(constructorMeta.outputs[key])(prototype, key);
      })
    }

    /** Apply @ActionEmitter **/
    Object.getOwnPropertyNames(serviceInstance).forEach(key => {
      const outputMeta = r.getMetadata(CONNECTED_COMPONENT_OUTPUT_METADATA_KEY, serviceInstance, key) as {actionFactory: (d: any) => Action, onInstance: Subject<EventEmitter<any>>};
      if(outputMeta) {
        if('actionFactory' in outputMeta && 'onInstance' in outputMeta) {
          const {actionFactory, onInstance} = outputMeta;
          //console.log(`${serviceInstance.name}.${key}`, serviceInstance[key], prototype, prototype[key])
          onInstance
            .mergeMap((ee:EventEmitter<any>) => ee)
            .subscribe(d => {
              this.store.dispatch(actionFactory(d))
            });
        } else {
          console.warn(`no subscribe function in ${serviceInstance.name}.${key}, no action will ever be dispatched`);
        }
      }
    });


    /** Apply @ActionCreator **/
    Object.getOwnPropertyNames(prototype).forEach(methodName => {
      const cfg = r.getMetadata(ACTION_CREATOR_METADATA_KEY, serviceInstance, methodName) as ActionCreatorConfig;
      if(cfg != null) {
        const cTor = prototype.constructor;
        const actionType = (lc = AsyncActionLifecycle.Init) => actionTypeFor(cTor as Type<any>, methodName, lc);
        const defaultDescriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
        const {store} = this;
        Object.defineProperty(prototype, methodName, {
          ...defaultDescriptor,
          value: function(...args:any[]) {
            const {value} = defaultDescriptor;
            const result = value.apply(serviceInstance, args);
            const dispatchSuccess = payload => store.dispatch({type: `${actionType(AsyncActionLifecycle.Success)}`, payload});
            const dispatchDefault = payload => store.dispatch({type: actionType(), payload});
            const dispatchError = error => store.dispatch({type: actionType(), error});
            if(result instanceof Observable) {
              const shared = result.share();
              dispatchDefault(null);
              if(cfg.autoSubscribe) {
                shared.subscribe(dispatchSuccess)
              } else {
                shared.do(dispatchSuccess)
              }
              shared
                .catch(error => {
                  dispatchError(error);
                  return Observable.throw(error);
                });
              return shared;
            } else
            if(isPromiseLike(result)) {
              return result.then(
                payload => store.dispatch({type: `${actionType(AsyncActionLifecycle.Success)}`, payload}),
                error => {
                  store.dispatch({type: `${actionType(AsyncActionLifecycle.Error)}`, error});
                  throw error;
                }
              )
            } else {
              store.dispatch({type: actionType(), payload: result});
              return result;
            }
          }
        })
      }
    })
  }

}
