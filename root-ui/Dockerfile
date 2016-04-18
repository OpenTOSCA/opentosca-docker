FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV CONTAINER_HOST=localhost

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

# Install root-ui
WORKDIR /opt
RUN git clone https://github.com/OpenTOSCA/ui-root
WORKDIR /opt/ui-root
RUN sed -i "s/:\/\/<%= host %>:/:\/\/$CONTAINER_HOST:/g" src/main/webapp/index.jsp
RUN mvn clean package

CMD cp /opt/ui-root/target/ROOT.war /opt/tomcat/webapps
