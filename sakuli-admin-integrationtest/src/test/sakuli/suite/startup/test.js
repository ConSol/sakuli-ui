define("page-objects/LoginPage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginPage = /** @class */ (function () {
        function LoginPage() {
        }
        Object.defineProperty(LoginPage.prototype, "userName", {
            set: function ($userName) {
                _highlight(_textbox("username"));
                _setValue(_textbox("username"), $userName);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginPage.prototype, "password", {
            set: function ($password) {
                _setValue(_password("password"), $password);
            },
            enumerable: true,
            configurable: true
        });
        LoginPage.prototype.doLogin = function () {
            _click(_submit('Login'));
        };
        return LoginPage;
    }());
    exports.LoginPage = LoginPage;
});
define("test", ["require", "exports", "page-objects/LoginPage"], function (require, exports, LoginPage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var testCase = new TestCase(45, 65);
    var env = new Environment();
    var loginPage = new LoginPage_1.LoginPage();
    try {
        var $URL = "http://" + env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_ADDR") + ":" + env.getEnv("SAKULI_TESTS_SERVER_PORT_8080_TCP_PORT");
        Logger.logInfo("URL is:" + $URL);
        _navigateTo($URL);
        _call(top.location.reload());
        /*
        loginPage.userName = "admin";
        loginPage.password = "sakuli123";
        //env.sleep(5)
        loginPage.doLogin();
        */
        var $userName = "admin";
        var $password = "sakuli123";
        _highlight(_textbox("username"));
        _setValue(_textbox("username"), $userName);
        _highlight(_textbox("username"));
        _highlight(_password("password"));
        _setValue(_password("password"), $password);
        _highlight(_password("password"));
        _click(_submit('Login'));
    }
    catch (e) {
        testCase.handleException(e);
    }
    finally {
        env.sleep(30000);
    }
});
