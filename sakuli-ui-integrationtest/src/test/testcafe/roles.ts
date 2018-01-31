import {pageUrl} from "./page-url";
import {LoginPage} from "./pages/LoginPage";
import {Role} from "testcafe";

const loginPage = new LoginPage();

const defaultUser = Role(pageUrl, async t => {
    await loginPage.login('admin', 'sakuli123');
});