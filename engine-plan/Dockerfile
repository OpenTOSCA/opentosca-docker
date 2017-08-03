FROM openjdk:8
LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ARG BPS_HOME=/opt/bps
ARG BPS_DOWNLOAD_URL=http://files.opentosca.org/third-party/v2.0.0/wso2bps-2.1.2-java8.zip
ARG BPEL4RESTLIGHT_DOWNLOAD_URL=http://files.opentosca.org/third-party/v2.0.0/bpel4restlight1.1.1.jar
ARG DOCKERIZE_VERSION=v0.3.0

ENV BPS_HOME /opt/bps
ENV REMOTE_HOSTNAME engine-plan

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN apt-get update -qq && apt-get install -qqy \
        unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN wget -O wso2bps-2.1.2.zip ${BPS_DOWNLOAD_URL} \
    && unzip -qo wso2bps-2.1.2.zip -d /opt || true \
    && mv -T /opt/wso2bps-2.1.2 ${BPS_HOME} \
    && chmod +x ${BPS_HOME}/bin/wso2server.sh \
    && wget -O ${BPS_HOME}/repository/components/lib/bpel4restlight1.1.1.jar ${BPEL4RESTLIGHT_DOWNLOAD_URL} \
    && rm wso2bps-2.1.2.zip

ADD carbon.xml.tpl /opt/carbon.xml.tpl

EXPOSE 9443 9763

WORKDIR ${BPS_HOME}
CMD dockerize -template /opt/carbon.xml.tpl:${BPS_HOME}/repository/conf/carbon.xml \
    ${BPS_HOME}/bin/wso2server.sh
