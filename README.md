[![Waffle.io - Columns and their card count](https://badge.waffle.io/ConSol/sakuli-ui.svg?columns=all)](https://waffle.io/ConSol/sakuli-ui)

# Sakuli-UI

A (web-based) UI to manage, edit and run Tests with [Sakuli E2E](https://github.com/ConSol/sakuli)

## Development 

To develop or extend Sakuli-UI we recommend to start separate server (Spring Boot) and client (Angular2) development worksflows to archieve to best development experience

### Server development

All server code is located in the [sakuli-admin-web]() maven module. You can run the server with spring-boots maven plugin like this:

`mvn spring-boot:run -pl citrus-admin-web`

The port is configurable with the server.port parameter e.g.

`mvn spring-boot:run -pl citrus-admin-web -Dserver.port=9090`

### Client Development 

For faster feedback cycles during client development, you need to run the angular-cli development server from the client project root

``` bash
cd sakuli-admin/src/main/resources
npm run start
```

This starts the development server on port 4200, all changes leads to an instant reload of the page (after recompiling the angular app).

The development server requires a running backend server. All request to the server are proxied by frontend development server.

Please ensure that the ports defined in [proxy.conf.json](sakuli-admin/src/main/resources/proxy.conf.json) and the running server instance are matching.