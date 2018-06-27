#ATTENTION: only used by dev: orig sakuli-ui image is placed at sakuli repository

FROM consol/sakuli-ui:dev
USER 0
ADD target/sakuli-ui-web-0.10.0-77-did-SNAPSHOT.jar /app/sakuli-ui-web.jar

RUN $INST_SCRIPTS/set_user_permission.sh /app
USER $SAKULI_UI_DOCKER_USER_ID

#docker build . -t local/sakuli-ui && docker run -it -p 8080:8080 --volume /var/run/docker.sock:/var/run/docker.sock --volume ~:/opt/sakuli-ui-root  -p 5005:5005 local/sakuli-ui java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -Dsakuli.ui.root.directory=/opt/sakuli-ui-root -jar /app/sakuli-ui-web.jar
