import {Component, Input} from "@angular/core";

export function createComponent<I>(template: string, inputs?: I) {
  const cls = class {};

  Object.keys(inputs || {} as any).forEach(k => {
    Input()(cls, k);
  })

  return Component({
    selector:'my-test-component',
    template,
  })
  (cls)
}

export const MyTestComponent = createComponent(`
  <h1>Hello {{testCase.name}}</h1>
`, {testCase: null})
