[![Waffle.io - Columns and their card count](https://badge.waffle.io/ConSol/sakuli-ui.svg?columns=all)](https://waffle.io/ConSol/sakuli-ui)

# Sakuli-UI

A (web-based) UI to manage, edit and run Tests with [Sakuli E2E](https://github.com/ConSol/sakuli)

## Development 

To develop or extend Sakuli-UI we recommend to start separate server (Spring Boot) and client (Angular2) development worksflows to archieve to best development experience

### Server development

All server code is located in the [sakuli-ui-web](./sakuli-ui-web) maven module. You can run the server with spring-boots maven plugin like this:

    mvn spring-boot:run -pl sakuli-ui-web`

The port is configurable with the server.port parameter e.g.

    mvn spring-boot:run -pl sakuli-ui-web -Dserver.port=9090

### Client Development 

For faster feedback cycles during client development, you need to run the angular-cli development server from the client project root

``` bash
cd sakuli-ui-client/src/main/resources
npm run start
```

This starts the development server on port 4200, all changes leads to an instant reload of the page (after recompiling the angular app).

The development server requires a running backend server. All request to the server are proxied by frontend development server.

Please ensure that the ports defined in [proxy.conf.json](sakuli-ui-client/src/main/resources/proxy.conf.json) and the running server instance are matching.


## Build & Start executable JAR

To build a ready-to-use executable JAR, just type

    mvn clean install
    
then Maven will build a executable jar `sakuli-ui-web-XXX.jar` under `sakuli-ui-web/target/`. Now you can execute the JAR file:

    java -jar sakuli-ui-web/target/sakuli-ui-web-XXX.jar
   
## Disable Authentication

    java -Dapp.authentication.enabled=false -jar sakuli-ui-web/target/sakuli-ui-web-XXX.jar

    
## Default Credentials

User: `admin`
Password: `sakuli123`

To set your own credentials just set the properties `security.default-username` and `security.default-password`:

    java -Dsecurity.default-username=myadmin -Dsecurity.default-password=mypassword -jar sakuli-ui-web/target/sakuli-ui-web-XXX.jar

**ATTENTION:** the `-Dxxx` property overwriting have to set before `-jar`, see [Spring Boot - External Config](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html)
