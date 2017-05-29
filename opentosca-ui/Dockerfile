FROM maven:3-jdk-8

LABEL maintainer "Michael Wurster <miwurster@gmail.com>"

ARG GIT_REPO_URL=https://github.com/OpenTOSCA/ui.git
ARG GIT_BRANCH=master

ENV CATALINA_HOME /usr/local/tomcat

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/opentosca-ui
RUN git clone --recursive --depth=1 ${GIT_REPO_URL} -b ${GIT_BRANCH} /opt/opentosca-ui \
    && mvn package

CMD cp /opt/opentosca-ui/build/target/opentosca.war ${CATALINA_HOME}/webapps
