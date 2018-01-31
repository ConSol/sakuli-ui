package org.sweetest.platform.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.AppUserDetails;

@Service
public class AppUserService implements UserDetailsService {

    private AppUserDetails defaultUser;

    public AppUserService(
            @Autowired BCryptPasswordEncoder bCryptPasswordEncoder,
            @Value("${security.default-username}") String defaultUsername,
            @Value("${security.default-password}") String defaultUserPassword
    ) {
        defaultUser = new AppUserDetails(
                defaultUsername,
                bCryptPasswordEncoder.encode(defaultUserPassword));
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        if(userName.equals(defaultUser.getUsername())) {
            return defaultUser;
        } else  {
            throw new UsernameNotFoundException("Cannot find User: " + userName);
        }
    }
}
