FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV TOMCAT_HOME /opt/tomcat

ENV HOME /root
WORKDIR ${HOME}

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:/opt/apache-maven-${MAVEN_VERSION}/bin/

# Replace /dev/random by /dev/urandom to avoid blocking
RUN rm /dev/random && ln -s /dev/urandom /dev/random

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y wget git openjdk-7-jdk && \
    apt-get clean -y
RUN wget ${MAVEN_URL} && \
    tar -zxf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    cp -R apache-maven-${MAVEN_VERSION} /opt

# Install admin-ui
RUN git clone https://github.com/OpenTOSCA/ui-admin.git /opt/admin-ui
WORKDIR /opt/admin-ui
RUN mvn clean package

CMD cp /opt/admin-ui/target/admin.war $TOMCAT_HOME/webapps
