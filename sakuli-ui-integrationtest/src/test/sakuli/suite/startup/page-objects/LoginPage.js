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
