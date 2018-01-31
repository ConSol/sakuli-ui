"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testcafe_1 = require("testcafe");
var FileSelector = /** @class */ (function () {
    function FileSelector() {
        this.root = testcafe_1.Selector('sc-file-selector-modal-component');
        this.title = this.root.find('h4');
        this.entries = this.root.find('ul li');
    }
    return FileSelector;
}());
exports.FileSelector = FileSelector;
