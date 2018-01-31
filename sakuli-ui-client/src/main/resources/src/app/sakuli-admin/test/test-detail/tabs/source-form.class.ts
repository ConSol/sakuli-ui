import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export class SourceForm extends FormGroup {
  private static URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;

  constructor(source: string, startUrl: string) {
    super({
      source: new FormControl(source),
      startUrl: new FormControl(startUrl, [
        Validators.pattern(SourceForm.URL_REGEX),
        Validators.required
      ])
    })
  }

  get sourceControl(): AbstractControl {
    return this.get('source');
  }

  get source() {
    return this.sourceControl.value;
  }

  set source(source: string) {
    this.setValue({source})
  }

  get startUrlControl(): AbstractControl {
    return this.get('startUrl');
  }

  set startUrl(startUrl: string) {
    this.setValue({startUrl})
  }

  get startUrl() {
    return this.get('startUrl').value;
  }

  get hasInvalidUrl() {
    return this.startUrlControl.errors;
  }
}
