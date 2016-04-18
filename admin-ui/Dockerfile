FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV CONTAINER_HOST localhost

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV HOME /root
WORKDIR ${HOME}

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:/opt/apache-maven-${MAVEN_VERSION}/bin/

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y wget git openjdk-7-jdk && \
    apt-get clean -y
RUN wget ${MAVEN_URL} && \
    tar -zxf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    cp -R apache-maven-${MAVEN_VERSION} /opt

# Install admin-ui
WORKDIR /opt
RUN git clone https://github.com/OpenTOSCA/ui-admin
WORKDIR /opt/ui-admin
RUN sed -i "s/\"http:\/\/\" + host + \":1337\/containerapi\"/\"http:\/\/$CONTAINER_HOST:1337\/containerapi\"/g" src/main/java/org/opentosca/ui/admin/action/client/ContainerClient.java
RUN mvn clean package

CMD cp /opt/ui-admin/target/admin.war /opt/tomcat/webapps
