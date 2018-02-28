import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'simple-image-component',
  template: `
    <img [src]="src" />
  `
})

export class SimpleImageComponent implements OnInit {

  @Input() src: string = 'https://wallpaperbrowse.com/media/images/10-kitten-cuteness-1.jpg';

  constructor() {
  }

  ngOnInit() {
  }
}
