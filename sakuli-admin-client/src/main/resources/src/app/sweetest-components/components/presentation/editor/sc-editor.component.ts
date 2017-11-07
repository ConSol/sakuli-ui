import {
  AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output,
  ViewChild
} from "@angular/core";
import * as ace from 'brace';
import 'brace';
import 'brace/theme/chrome';
import 'brace/mode/javascript';
import 'brace/mode/properties';
import 'brace/mode/dockerfile';
import 'brace/mode/yaml';
import {ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {EditorModes} from "./editor-modes.interface";
import {Deferred} from "../../../utils";

const noop = (..._: any[]) => {};

@Component({
  selector: 'sc-editor',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ScEditorComponent),
    multi: true
  }],
  template: `
    <ng-content select="nav.navbar.top"></ng-content>
    <pre [id]="id" class="editor" #editorEl></pre>
    <ng-content select="nav.navbar.bottom"></ng-content>
  `,
  styles: [`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .editor {
      width: 100%;
      flex-grow: 1;
      margin: 0;
    }
  `]
})
export class ScEditorComponent implements AfterViewInit, ControlValueAccessor {

  _editor: ace.Editor;

  onChange = noop;
  onTouched = noop;

  @ViewChild('editorEl') editorEl: ElementRef;

  @Output() change = new EventEmitter<any>();

  @Input() mode: string = 'javascript';

  deferredEditor = new Deferred<ace.Editor>();

  private hasInitialised = false;

  set editor(editor: ace.Editor) {
    this._editor = editor;
    this.deferredEditor.resolve(editor);
  }

  get editor() {
    return this._editor;
  }

  private static instanceCounter = 0;

  id = `sc-editor-instance-${ScEditorComponent.instanceCounter++}`;

  ngOnInit() {
    if(EditorModes.indexOf(this.mode) === -1) {
      throw Error(`Invalid mode ${this.mode} please check if the mode is defined in ${module.id}`)
    }
  }

  ngAfterViewInit() {
    this.editor = ace.edit(this.id);
    this.deferredEditor.resolve(this._editor);
    this.editor.setTheme(`ace/theme/chrome`);
    this.editor.session.setMode(`ace/mode/${this.mode}`);
    //this.editor.$blockScrolling = Infinity;
    this.editor.setValue("");
    this.editor.getSession().on('change', e => this.hasInitialised ? this.change.next(e): noop());
    this.editor.getSession().on('blur', e => this.onTouched());
    this.change.subscribe(_ => this.onChange(this.editor.getValue()));
  }

  async writeValue(value: any = '') {
    const editor = await this.deferredEditor.getValue();
    editor.setValue(value);
    if(!this.hasInitialised) {
      editor.moveCursorToPosition({row: 0, column: 0});
      editor.focus();
    }
    this.hasInitialised = true;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  async setDisabledState(isDisabled: boolean) {
    const editor = await this.deferredEditor.getValue();
    editor.setReadOnly(isDisabled);
  }


}

