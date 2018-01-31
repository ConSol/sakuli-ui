package org.sweetest.platform.server.filter;

public class Credentials {
    private String username;
    private String password;

    public Credentials() {}

    public Credentials(String userName, String password) {
        this.username = userName;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
