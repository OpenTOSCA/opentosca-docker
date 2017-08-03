FROM maven:3-jdk-8 as builder

ADD /c/work/git/opentosca/opentosca-ui /tmp/git
ARG GIT_REPO_URL=/tmp/git

ARG GIT_BRANCH=master
RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/opentosca/web
RUN git clone --recursive --depth=1 ${GIT_REPO_URL} -b ${GIT_BRANCH} /opt/opentosca/web \
    && mvn package

FROM openjdk:8
LABEL maintainer "Michael Wurster <miwurster@gmail.com>"

RUN rm /dev/random && ln -s /dev/urandom /dev/random

COPY --from=builder /opt/opentosca/web/build/target /opt/opentosca/web

WORKDIR /opt/opentosca/web

EXPOSE 8088

CMD java -jar /opt/opentosca/web/opentosca-ui.war --server.port=8088
