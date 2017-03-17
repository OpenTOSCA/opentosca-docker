FROM openjdk:7

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ENV REMOTE_HOSTNAME localhost

ENV BPS_HOME /opt/bps
ENV BPS_DOWNLOAD_URL http://www.iaas.uni-stuttgart.de/OpenTOSCA/third-party/wso2bps-2.1.2.zip
ENV BPEL4RESTLIGHT_DOWNLOAD_URL https://github.com/OpenTOSCA/OpenTOSCA.github.io/raw/gh-pages/third-party/bpel4restlight1.1.1.jar

ENV DOCKERIZE_VERSION v0.3.0

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN apt-get update -y \
    && apt-get install -y unzip \
    && apt-get clean -y

WORKDIR /tmp
RUN wget ${BPS_DOWNLOAD_URL} \
    && unzip -qo wso2bps-2.1.2.zip -d /opt || true \
    && mv -T /opt/wso2bps-2.1.2 ${BPS_HOME} \
    && chmod +x ${BPS_HOME}/bin/wso2server.sh \
    && wget -O ${BPS_HOME}/repository/components/lib/bpel4restlight1.1.1.jar ${BPEL4RESTLIGHT_DOWNLOAD_URL} \
    && rm wso2bps-2.1.2.zip

ADD carbon.xml.tpl /opt/carbon.xml.tpl
ADD bps.xml ${BPS_HOME}/repository/conf/bps.xml

EXPOSE 9443 9763

WORKDIR ${BPS_HOME}
CMD dockerize -template /opt/carbon.xml.tpl:${BPS_HOME}/repository/conf/carbon.xml \
    ${BPS_HOME}/bin/wso2server.sh
