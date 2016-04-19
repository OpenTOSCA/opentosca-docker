FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV TOMCAT_VERSION 7.0.30
ENV TOMCAT_URL http://archive.apache.org/dist/tomcat/tomcat-7/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz
ENV TOMCAT_HOME /opt/tomcat
ENV CATALINA_HOME ${TOMCAT_HOME}
ENV TOMCAT_USERNAME tcManager
ENV TOMCAT_PASSWORD 4Syq5MQeedIDzzP6BG7b

ENV DOCKERIZE_VERSION 0.2.0

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:${CATALINA_HOME}/bin

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
    ln -s /opt/apache-tomcat-${TOMCAT_VERSION} ${CATALINA_HOME} && \
    rm /tmp/catalina.tar.gz && \
    rm -rf ${CATALINA_HOME}/webapps/examples ${CATALINA_HOME}/webapps/docs && \
    rm /dev/random && ln -s /dev/urandom /dev/random

EXPOSE 8080 8778

#CMD [ "/opt/tomcat/bin/catalina.sh", "run" ]
CMD dockerize -template /opt/tomcat-users.xml.tpl:$CATALINA_HOME/conf/tomcat-users.xml $CATALINA_HOME/bin/catalina.sh run

#
# docker build -t opentosca/container-tomcat .
# docker run -d -p 8080:8080 -p 8778:8778 opentosca/container-tomcat
#
