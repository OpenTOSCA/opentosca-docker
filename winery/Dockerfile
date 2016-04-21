FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV WINERY_BRANCH master
ENV WINERY_REV HEAD

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV TOMCAT_HOME /opt/tomcat

ENV NVM_HOME /opt/nvm
ENV NVM_VERSION 0.31.0
ENV NODE_VERSION 4
ENV BOWER_VERSION 1.7.9

ENV HOME /root
WORKDIR ${HOME}

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:/opt/apache-maven-${MAVEN_VERSION}/bin/

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y git wget openjdk-7-jdk build-essential && \
    apt-get clean -y
RUN wget ${MAVEN_URL} && \
    tar -zxf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    cp -R apache-maven-${MAVEN_VERSION} /opt
RUN git clone https://github.com/creationix/nvm.git ${NVM_HOME} && \
    cd ${NVM_HOME} && \
    git checkout tags/v${NVM_VERSION}
RUN . ${NVM_HOME}/nvm.sh && \
    nvm install ${NODE_VERSION} && \
    nvm use ${NODE_VERSION} && \
    nvm alias default ${NODE_VERSION} && \
    npm install -g bower@${BOWER_VERSION}

# Install winery
RUN git clone --recursive git://git.eclipse.org/gitroot/winery/org.eclipse.winery.git -b ${WINERY_BRANCH} /opt/winery
WORKDIR /opt/winery
RUN git checkout ${WINERY_REV} && git reset --hard

WORKDIR /opt/winery/org.eclipse.winery.model.csar.toscametafile
RUN mvn install
WORKDIR /opt/winery/org.eclipse.winery.model.selfservice
RUN mvn install
WORKDIR /opt/winery/org.eclipse.winery.model.tosca
RUN mvn install

WORKDIR /opt/winery
RUN . ${NVM_HOME}/nvm.sh && \
    mvn clean package

CMD cp /opt/winery/org.eclipse.winery.repository/target/winery.war $TOMCAT_HOME/webapps/ && \
    cp /opt/winery/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war $TOMCAT_HOME/webapps/
