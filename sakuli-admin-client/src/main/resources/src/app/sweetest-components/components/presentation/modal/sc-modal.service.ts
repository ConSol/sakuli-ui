import {Injectable, Type} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

declare const Reflect: any;

export interface ModalAware {
  getActiveModal(): NgbActiveModal
}

@Injectable()
export class ScModalService {

  private instances = new WeakMap<Type<any>, NgbActiveModal>();
  private components: Type<ModalAware>[] = [];

  constructor(private modal: NgbModal) {
  }

  async open<T extends ModalAware>(component: Type<T>, inputs: Partial<T>, onref?: (component: T) => void): Promise<any> {
    const annotations = Reflect.getMetadata('annotations', component) || [];
    const {selector} = annotations.find(a => 'selector' in a) || {selector: component.name};
    const {componentInstance, result} = this.modal.open(component, {
      windowClass: selector
    });

    Object.keys(inputs).forEach((key: keyof T) => componentInstance[key] = inputs[key]);
    if (onref) {
      onref(componentInstance)
    }
    this.closeAll();
    this.components.push(component);
    this.instances.set(component, componentInstance.getActiveModal());
    return result;
  }

  closeAll() {
    this.components
      .forEach(c => {
        console.log(this.instances);
        this.instances.get(c).dismiss();
        this.instances.delete(c);
      });
    this.components = [];
  }

}
