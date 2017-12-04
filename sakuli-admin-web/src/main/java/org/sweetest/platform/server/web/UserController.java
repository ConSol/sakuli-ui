package org.sweetest.platform.server.web;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.sweetest.platform.server.filter.Credentials;

@Controller
@RequestMapping("api/user")
public class UserController {

    private BCryptPasswordEncoder bCryptPasswordEncoder;


    public UserController(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/login")
    public void login(@RequestBody Credentials credentials) {

    }
}
