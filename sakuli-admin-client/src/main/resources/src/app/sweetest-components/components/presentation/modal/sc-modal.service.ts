import {Injectable, Type} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ComponentMetadata} from "codelyzer/angular/metadata";

declare const Reflect:any;

@Injectable()
export class ScModalService {

  constructor(private modal: NgbModal) {
  }

  async open<T>(component: Type<T>, inputs: Partial<T>, onref?: (component: T) => void): Promise<any> {
    const annotations = Reflect.getMetadata('annotations', component) || [];
    const {selector} = annotations.find(a => 'selector' in a) || {selector: component.name};
    const {componentInstance, result} = this.modal.open(component, {
      windowClass: selector
    });
    Object.keys(inputs).forEach((key: keyof T) => componentInstance[key] = inputs[key]);
    if (onref) {
      onref(componentInstance)
    }
    return result;
  }

}
