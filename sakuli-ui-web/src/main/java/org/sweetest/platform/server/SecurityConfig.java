package org.sweetest.platform.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.sweetest.platform.server.filter.JwtAuthenticationFilter;
import org.sweetest.platform.server.filter.JwtAuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String SECRET = "SecretKeyToGenJWTs";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/login";
    public static final String LOGOUT_URL = "/logout";


    @Value("${security.signing-key}")
    private String signingKey;

    @Value("${security.encoding-strength}")
    private Integer encodingStrength;

    @Value("${security.security-realm")
    private String securityRealm;

    @Value("${app.authentication.enabled}")
    private boolean authenticationEnabled;

    private UserDetailsService userDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncode;

    public SecurityConfig (
            @Autowired UserDetailsService userDetailsService,
            @Autowired BCryptPasswordEncoder bCryptPasswordEncoder
    ) {
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncode = bCryptPasswordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //disabeld because form data request failing otherwise
        http.csrf().disable();
        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Allows embedding of vnc proxy view; by default this is denied
        http.headers().frameOptions().sameOrigin();
        if(authenticationEnabled) {
            http.authorizeRequests()
                        .antMatchers(HttpMethod.POST, SIGN_UP_URL, LOGOUT_URL)
                            .permitAll()
                        .antMatchers(HttpMethod.GET, "/", "/**/*.js", "/**/*.css", "/**/*.woff*")
                            .permitAll()
                    // TODO: Right now sockets are not secured, this is actually not the best way
                        .antMatchers("/api/info" , "/api/socket/**")
                            .permitAll()
                        .antMatchers("/api/**")
                            .authenticated()
                    .and()
                        .addFilter(new JwtAuthenticationFilter(authenticationManager()))
                        .addFilter(new JwtAuthorizationFilter(authenticationManager()));
        }
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncode);
    }

}
