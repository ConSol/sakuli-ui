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
var ScHeaderComponent = (function () {
    function ScHeaderComponent() {
    }
    Object.defineProperty(ScHeaderComponent.prototype, "hostClass", {
        get: function () {
            return 'navbar sticky-top navbar-primary navbar-toggleable-sm';
        },
        enumerable: true,
        configurable: true
    });
    ScHeaderComponent.prototype.ngOnInit = function () {
        console.log('links', this.links);
    };
    return ScHeaderComponent;
}());
__decorate([
    core_1.HostBinding('class')
], ScHeaderComponent.prototype, "hostClass");
__decorate([
    core_1.Input()
], ScHeaderComponent.prototype, "brandLogo");
__decorate([
    core_1.Input()
], ScHeaderComponent.prototype, "brandName");
__decorate([
    core_1.ViewChild('links')
], ScHeaderComponent.prototype, "links");
ScHeaderComponent = __decorate([
    core_1.Component({
        selector: 'sc-header',
        template: "\n      <button class=\"navbar-toggler\" \n              type=\"button\" data-toggle=\"collapse\" \n              data-target=\"#navbarTogglerDemo01\" \n              aria-controls=\"navbarTogglerDemo01\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n        <span class=\"navbar-toggler-icon\"></span>\n      </button>\n      <div class=\"collapse navbar-collapse\" id=\"navbarTogglerDemo01\">\n        <a class=\"navbar-brand\" href=\"#\">\n          <img *ngIf=\"brandLogo\" [src]=\"brandLogo\"/>\n          <span *ngIf=\"brandName\">{{brandName}}</span>\n        </a>\n        <ul class=\"navbar-nav mr-auto mt-2 mt-lg-0\" #links>\n          <ng-content select=\"sc-link\"></ng-content>\n        </ul>\n      </div>\n    ",
        styles: ["\n        :host {\n            background-color: " + theme_1.Theme.colors.primary + "\n        }\n    "]
    })
], ScHeaderComponent);
exports.ScHeaderComponent = ScHeaderComponent;
