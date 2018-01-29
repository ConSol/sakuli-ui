"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testcafe_1 = require("testcafe");
var AppShell = /** @class */ (function () {
    function AppShell() {
        this.toasts = testcafe_1.Selector('sc-toast');
    }
    return AppShell;
}());
exports.AppShell = AppShell;
