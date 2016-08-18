FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV REMOTE_HOSTNAME localhost

ENV BPS_URL http://www.iaas.uni-stuttgart.de/OpenTOSCA/third-party/wso2bps-2.1.2.zip
ENV BPS_RESTEXT_URL https://github.com/OpenTOSCA/OpenTOSCA.github.io/raw/gh-pages/third-party/bpel4restlight1.1.jar 
ENV BPS_HOME /opt/bps
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/

ENV DOCKERIZE_VERSION 0.2.0

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:${BPS_HOME}/bin

ADD carbon.xml.tpl /opt/carbon.xml.tpl

# Replace /dev/random by /dev/urandom to avoid blocking
RUN rm /dev/random && ln -s /dev/urandom /dev/random

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y wget unzip openjdk-7-jdk && \
    apt-get clean -y
RUN wget https://github.com/jwilder/dockerize/releases/download/v${DOCKERIZE_VERSION}/dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz

# Install WSO2 BPS and REST extension
RUN wget ${BPS_URL} && \
    unzip -qo wso2bps-2.1.2.zip || true && \
    mv wso2bps-2.1.2 ${BPS_HOME} && \
    chmod +x ${BPS_HOME}/bin/wso2server.sh && \
    wget -O ${BPS_HOME}/repository/components/lib/bpel4restlight1.1.jar ${BPS_RESTEXT_URL}

ADD bps.xml ${BPS_HOME}/repository/conf/bps.xml

EXPOSE 9443 9763

#CMD [ "/opt/bps/bin/wso2server.sh" ]
CMD dockerize -template /opt/carbon.xml.tpl:$BPS_HOME/repository/conf/carbon.xml $BPS_HOME/bin/wso2server.sh
