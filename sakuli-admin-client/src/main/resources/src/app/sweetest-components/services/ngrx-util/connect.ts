import {Component, EventEmitter, Type} from "@angular/core";
import {Action, MemoizedSelector} from "@ngrx/store";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ActionCreator} from "./action-creator-metadata";

const r: any = Reflect;

export const CONNECTED_COMPONENT_METADATA_KEY = '[ngrx-uitls] connected component metadata key'
export const CONNECTED_COMPONENT_INPUT_METADATA_KEY = '[ngrx-uitls] connected component input metadata key'
export const CONNECTED_COMPONENT_OUTPUT_METADATA_KEY = '[ngrx-uitls] connected component output metadata key'

export interface SelectorAndValueSubject<S,V> {
  selector: MemoizedSelector<S,V>,
  value: Subject<V>
}

export function Select<S,R>(selector: MemoizedSelector<S,R>) {
  return (target: any, key: string, descriptor?: PropertyDescriptor) => {
    let instanceValue: any;
    let value: any;
    let subject: Subject<any> = new Subject();
    r.defineMetadata(CONNECTED_COMPONENT_INPUT_METADATA_KEY, {selector, value:subject}, target, key);

    subject.subscribe(v => {
      instanceValue = v
    });
    function initOnInstance(instance: object) {
      Object.defineProperty(instance, key, {
        get: function() {
          return instanceValue;
        },
        set: function(v: any) {
          subject.next(v);
        }
      })
    }

    /** Define Property on Class Level **/
    Object.defineProperty(target, key, {
      get: function() {
        initOnInstance(this);
        return value;
      },
      set: function(v: any) {
        initOnInstance(this);
        value = v;
      }
    });
  }
}

const isEventEmitterCompatible = (o: any): o is EventEmitter<any> => {
  return o && 'next' in o && 'subscribe' in o;
}

export const ActionEmitter = (emitter: (e:any) => Action) => {
  return (target: any, key: string, descriptor?: PropertyDescriptor) => {
    let eventEmitter: EventEmitter<any>;
    let innerEventEmitter: EventEmitter<any>;
    let onInstance = new Subject();
    r.defineMetadata(CONNECTED_COMPONENT_OUTPUT_METADATA_KEY, {
      actionFactory:emitter,
      onInstance: onInstance.share()},
    target, key);

    function initOnInstance(instance: object) {
      Object.defineProperty(instance, key, {
        get: function() {
          return innerEventEmitter;
        },
        set: function(v: any) {
          if(isEventEmitterCompatible(v)) {
            innerEventEmitter = v;
            onInstance.next(innerEventEmitter);
          } else {
            console.warn(`${Object.getPrototypeOf(instance).constructor.name}.${key} must be an EventEmitter compatible instance`)
          }
        }
      })
    }

    /** Define Property on Class Level **/
    Object.defineProperty(target, key, {
      get: function() {
        initOnInstance(this);
        return eventEmitter;
      },
      set: function(v: any) {
        if(isEventEmitterCompatible(v)) {
          initOnInstance(this);
          eventEmitter = v;
        } else {
          console.warn(`${Object.getPrototypeOf(target).constructor.name}.${key} must be an EventEmitter compatible instance`)
        }
      }
    });
    target[key] = target[key];
  }
}

export type InputToSelectorMap<S,T> = {
  [P in keyof T]?: MemoizedSelector<S, T[P]>;
};

export type EventToActionMap<S, T> = {
  [P in keyof T]?: (e: any) => Action
}

export type ConnectedInputOutput<S, T> = {
  inputs: InputToSelectorMap<S ,T>
  outputs: EventToActionMap<S, T>
}

export function ConnectComponent<S, T>(
  inputs:   InputToSelectorMap<S,T>,
  outputs?: EventToActionMap<S, T>
  ) {
  return (component: Type<T> ) => {
    r.defineMetadata(CONNECTED_COMPONENT_METADATA_KEY, {inputs, outputs}, component)
    return component;
  }
}
