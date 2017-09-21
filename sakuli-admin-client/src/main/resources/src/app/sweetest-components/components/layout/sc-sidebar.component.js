"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var theme_1 = require("../theme");
var ScSidebarComponent = (function () {
    function ScSidebarComponent() {
    }
    Object.defineProperty(ScSidebarComponent.prototype, "hostClass", {
        get: function () {
            return 'col-xs-1 col-sm-3 flex';
        },
        enumerable: true,
        configurable: true
    });
    return ScSidebarComponent;
}());
__decorate([
    core_1.HostBinding('class')
], ScSidebarComponent.prototype, "hostClass");
ScSidebarComponent = __decorate([
    core_1.Component({
        selector: 'sc-sidebar',
        template: "\n      <ul class=\"nav flex-column\" #links>\n        <ng-content select=\"sc-link\"></ng-content>\n      </ul>\n    ",
        styles: ["\n        :host {\n            background-color: " + theme_1.Theme.colors.secondary + ";\n            color: #374d85\n        }\n        \n        :host /deep/ sc-link { \n            padding: 20px;\n        }\n        \n        :host /deep/ sc-link:hover {\n            background-color: #e3effc;\n        }\n    "]
    })
], ScSidebarComponent);
exports.ScSidebarComponent = ScSidebarComponent;
