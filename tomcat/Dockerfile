FROM tomcat:8-jre8

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ARG DOCKERIZE_VERSION=v0.3.0

ENV TOMCAT_USERNAME tcManager
ENV TOMCAT_PASSWORD 4Syq5MQeedIDzzP6BG7b

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ADD tomcat-users.xml.tpl ${CATALINA_HOME}/conf/tomcat-users.xml.tpl
ADD server.xml ${CATALINA_HOME}/conf/server.xml
ADD manager.xml ${CATALINA_HOME}/conf/Catalina/localhost/manager.xml

EXPOSE 8080

CMD dockerize -template ${CATALINA_HOME}/conf/tomcat-users.xml.tpl:${CATALINA_HOME}/conf/tomcat-users.xml \
    ${CATALINA_HOME}/bin/catalina.sh run
