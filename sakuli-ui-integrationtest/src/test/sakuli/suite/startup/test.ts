import {LoginPage} from "./page-objects/LoginPage";

const testCase = new TestCase(45, 65);
const env = new Environment();

const loginPage = new LoginPage();

try {
    const $URL = `http://${env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_ADDR")}:${env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_PORT")}`;
    Logger.logInfo("URL is:" + $URL);
    _navigateTo($URL);
    _call(top.location.reload());
    /*
    loginPage.userName = "admin";
    loginPage.password = "sakuli123";
    //env.sleep(5)
    loginPage.doLogin();
    */

    const $userName = "admin";
    const $password = "sakuli123";
    _highlight( _textbox("username"));
    _setValue( _textbox("username"), $userName);
    _highlight( _textbox("username"));


    _highlight(_password("password"));
    _setValue(_password("password"), $password);
    _highlight(_password("password"));

    _click(_submit('Login'));


} catch(e) {
    testCase.handleException(e)
} finally {
    env.sleep(30000);
}
