import {Selector} from "testcafe";

export class FileSelector {
    readonly root: Selector;
    readonly title: Selector;
    readonly entries: Selector;

    constructor() {
        this.root = Selector('sc-file-selector-modal-component');
        this.title = this.root.find('h4');
        this.entries = this.root.find('ul li');
    }

}