FROM maven:3-jdk-8 as builder

ARG GIT_REPO_URL=https://github.com/OpenTOSCA/ui.git
ARG GIT_BRANCH=master

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --recursive --depth=1 ${GIT_REPO_URL} -b ${GIT_BRANCH} /opt/opentosca/ui \
    && cd /opt/opentosca/ui \
    && mvn package


FROM openjdk:8
LABEL maintainer "Michael Wurster <miwurster@gmail.com>"

RUN rm /dev/random && ln -s /dev/urandom /dev/random

COPY --from=builder /opt/opentosca/ui/build/target /opt/opentosca/ui

WORKDIR /opt/opentosca/ui

EXPOSE 8088

CMD java -jar /opt/opentosca/ui/opentosca-ui.war --server.port=8088
