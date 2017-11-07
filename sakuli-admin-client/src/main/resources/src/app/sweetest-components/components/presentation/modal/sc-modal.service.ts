import {Injectable, Type} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class ScModalService {

  constructor(private modal: NgbModal) {
  }

  async open<T>(component: Type<T>, inputs: Partial<T>, onref?: (component: T) => void): Promise<any> {
    const {componentInstance, result} = this.modal.open(component);
    Object.keys(inputs).forEach((key: keyof T) => componentInstance[key] = inputs[key]);
    if (onref) {
      onref(componentInstance)
    }
    return result;
  }

}
