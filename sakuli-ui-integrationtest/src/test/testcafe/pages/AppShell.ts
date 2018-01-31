import {Selector} from "testcafe";

export class AppShell {
    readonly toasts: Selector;

    constructor() {
        this.toasts = Selector('sc-toast');
    }
}