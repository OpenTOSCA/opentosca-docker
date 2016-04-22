FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV REMOTE_HOSTNAME localhost

ENV TOMCAT_VERSION 7.0.30
ENV TOMCAT_URL http://archive.apache.org/dist/tomcat/tomcat-7/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz
ENV TOMCAT_HOME /opt/tomcat
ENV CATALINA_HOME ${TOMCAT_HOME}
ENV TOMCAT_USERNAME tcManager
ENV TOMCAT_PASSWORD 4Syq5MQeedIDzzP6BG7b

ENV DOCKERIZE_VERSION 0.2.0

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:${TOMCAT_HOME}/bin

ADD tomcat-users.xml.tpl /opt/tomcat-users.xml.tpl

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y wget openjdk-7-jdk && \
    apt-get clean -y
RUN wget https://github.com/jwilder/dockerize/releases/download/v${DOCKERIZE_VERSION}/dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz

# Install Tomcat
RUN wget ${TOMCAT_URL} -O /tmp/catalina.tar.gz && \
    tar -zxf /tmp/catalina.tar.gz -C /opt && \
    ln -s /opt/apache-tomcat-${TOMCAT_VERSION} ${TOMCAT_HOME} && \
    rm /tmp/catalina.tar.gz && \
    rm -rf ${TOMCAT_HOME}/webapps/examples ${TOMCAT_HOME}/webapps/docs && \
    rm /dev/random && ln -s /dev/urandom /dev/random

EXPOSE 8080 8778

#CMD [ "/opt/tomcat/bin/catalina.sh", "run" ]
CMD echo "127.0.0.1 $REMOTE_HOSTNAME" >> /etc/hosts && \
    dockerize -template /opt/tomcat-users.xml.tpl:$TOMCAT_HOME/conf/tomcat-users.xml $TOMCAT_HOME/bin/catalina.sh run
