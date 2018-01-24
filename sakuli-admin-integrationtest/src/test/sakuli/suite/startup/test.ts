import {LoginPage} from "./page-objects/LoginPage";

_dynamicInclude($includeFolder);

const testCase = new TestCase(45, 65);
const env = new Environment();

const loginPage = new LoginPage();

try {
    const $URL = `http://${env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_ADDR")}:${env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_PORT")}`;
    Logger.logInfo("URL is:" + $URL);
    _navigateTo($URL, true);

    loginPage.userName = "admin";
    loginPage.password = "sakuli123";

    loginPage.doLogin();

} catch(e) {
    testCase.handleException(e)
} finally {
    env.sleep(30000);
}
