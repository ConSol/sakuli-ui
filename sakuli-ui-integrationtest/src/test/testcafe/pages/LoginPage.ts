import {Selector, t} from "testcafe";

export class LoginPage {
    readonly userName: Selector;
    readonly submit: Selector;
    readonly password: Selector;

    constructor() {
        this.userName = Selector('input#username');
        this.password = Selector('input#password');
        this.submit = Selector('button[type="submit"]')
    }

    async login(user: string, password: string) {
        await  t
            .typeText(this.userName, user)
            .typeText(this.password, password)
            .click(this.submit)
    }
}