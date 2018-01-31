FROM consol/ubuntu-xfce-vnc

USER 0
RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install nodejs -y

RUN npm install -g testcafe

CMD testcafe



