//const $URL = `http://${env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_ADDR")}:${env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_PORT")}`;

import {LoginPage} from "./pages/LoginPage";
import {AppShell} from "./pages/AppShell";
import {FileSelector} from "./pages/FileSelector";
import {pageUrl} from "./page-url";

fixture `Getting Started`
    .page(pageUrl);

const loginPage = new LoginPage();
const appShell = new AppShell();
const fileSelector = new FileSelector();

test('invalid login', async t => {
    await loginPage.login("invalid", "invalid");

    await t.expect(appShell.toasts.textContent).contains("login failed");
});

test('valid login', async t => {
    await loginPage.login("admin", "sakuli");

    await t.expect(fileSelector.title.textContent).contains('Select');
});