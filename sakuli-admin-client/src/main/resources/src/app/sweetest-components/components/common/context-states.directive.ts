import {Directive, ElementRef} from '@angular/core';

interface ContextMap {
  [classId: string]: (classId: string, context: string, el?: any) => string
}

const defaultMapping = (classId: string, context: string) => `${classId}-${context}`;

const ContextMappings: ContextMap = {
  'btn':              defaultMapping,
  'alert':            defaultMapping,
  'list-group-item':  defaultMapping,
  'badge':            defaultMapping,
  'card':             defaultMapping
}

@Directive({
  selector: '[sc-primary]'
})
export class PrimaryContextDirective {
  constructor(private el: ElementRef) {
    Object.keys(ContextMappings)
      .filter(e => this.el.nativeElement.classList.contains(e))
      .forEach(e => {
        this.el.nativeElement.classList.add(ContextMappings[e](e, 'primary'))
      });
  }
}
