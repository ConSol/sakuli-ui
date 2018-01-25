export class LoginPage {

    set userName($userName: string) {
        _highlight( _textbox("username"));
        _setValue( _textbox("username"), $userName);
    }

    set password($password: string) {
        _setValue(_password("password"), $password);
    }

    doLogin() {
        _click(_submit('Login'));
    }

}