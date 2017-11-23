import {ActivatedRouteSnapshot, CanDeactivate} from "@angular/router";
import {Injectable} from "@angular/core";
import {FormBaseComponent} from "./form-base-component.interface";

@Injectable()
export class PreventRoutingGuardService implements CanDeactivate<FormBaseComponent> {

  canDeactivate(target: FormBaseComponent,  currentRoute: ActivatedRouteSnapshot) {
    console.log('Get form', target);
    if(null != target && (typeof target.getForm === 'function') && target.getForm().dirty) {
      return confirm("You have unsaved changes, would you like to proceed without saving?")
    }
    return true;
  }

}
