"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ScLinkComponent = (function () {
    function ScLinkComponent() {
        this.click = new core_1.EventEmitter();
    }
    ScLinkComponent.prototype.ngOnInit = function () {
        this.fixedIconWidth = true;
    };
    ScLinkComponent.prototype.onClick = function ($event) {
        $event.preventDefault();
        this.click.next(this);
    };
    return ScLinkComponent;
}());
__decorate([
    core_1.Input()
], ScLinkComponent.prototype, "icon");
__decorate([
    core_1.Input()
], ScLinkComponent.prototype, "fixedIconWidth");
__decorate([
    core_1.Input()
], ScLinkComponent.prototype, "href");
__decorate([
    core_1.Input()
], ScLinkComponent.prototype, "active");
__decorate([
    core_1.Output()
], ScLinkComponent.prototype, "click");
ScLinkComponent = __decorate([
    core_1.Component({
        selector: 'sc-link',
        template: "\n      <li class=\"nav-item\" [ngClass]=\"{active: active}\">\n        <a class=\"nav-link\" (click)=\"onClick($event)\">\n          <sc-icon [listItem]=\"true\" [icon]=\"icon\" [fixedWidth]=\"fixedIconWidth\">\n            <ng-content></ng-content> \n          </sc-icon>\n        </a>\n      </li>\n    ",
        styles: ["\n      a {\n          cursor: pointer;\n      }  \n    "]
    })
], ScLinkComponent);
exports.ScLinkComponent = ScLinkComponent;
