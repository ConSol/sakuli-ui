"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ScLayoutComponent = (function () {
    function ScLayoutComponent() {
    }
    return ScLayoutComponent;
}());
ScLayoutComponent = __decorate([
    core_1.Component({
        selector: 'sc-layout',
        template: "\n      <main>\n        <ng-content select=\"sc-header\"></ng-content>\n        <div class=\"row flex-row\">\n          <ng-content select=\"sc-sidebar\"></ng-content>\n          <ng-content select=\"sc-content\"></ng-content>\n        </div>\n      </main>\n    "
    })
], ScLayoutComponent);
exports.ScLayoutComponent = ScLayoutComponent;
