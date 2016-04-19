FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV CONTAINER_HOST localhost
ENV CONTAINER_PORT 1337

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV TOMCAT_HOME /opt/tomcat

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

# Install vinothek
WORKDIR /opt
RUN git clone https://github.com/OpenTOSCA/vinothek.git
WORKDIR /opt/vinothek
RUN sed -i "s/containerHost = split\[0\]/containerHost = \"$CONTAINER_HOST\"/g" src/main/java/org/opentosca/ui/vinothek/VinothekContainerClient.java
RUN sed -i "s/containerHost = containerTmp/containerHost = \"$CONTAINER_HOST\"/g" src/main/java/org/opentosca/ui/vinothek/VinothekContainerClient.java
RUN sed -i "s/containerPort = Integer.parseInt(split\[1\])/containerPort = $CONTAINER_PORT/g" src/main/java/org/opentosca/ui/vinothek/VinothekContainerClient.java
RUN mvn clean package

CMD cp /opt/vinothek/target/vinothek.war $TOMCAT_HOME/webapps
