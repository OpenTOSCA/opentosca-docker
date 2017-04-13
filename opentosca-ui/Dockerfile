FROM maven:3-jdk-8

LABEL maintainer "Michael Wurster <miwurster@gmail.com>"

ARG OPENTOSCA_UI_BRANCH=master
ARG OPENTOSCA_UI_REV=HEAD

ENV CATALINA_HOME /usr/local/tomcat

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/opentosca-ui
RUN git clone --recursive https://github.com/OpenTOSCA/ui.git -b ${OPENTOSCA_UI_BRANCH} /opt/opentosca-ui \
    && git checkout ${OPENTOSCA_UI_REV} \
    && git reset --hard \
    && mvn clean package

CMD cp /opt/opentosca-ui/build/target/opentosca.war ${CATALINA_HOME}/webapps
