FROM maven:3-jdk-8 as builder

LABEL maintainer "Michael Wurster <miwurster@gmail.com>"

ARG GIT_REPO_URL=https://github.com/OpenTOSCA/ui.git
ARG GIT_BRANCH=master

WORKDIR /opt/opentosca-ui
RUN git clone --recursive --depth=1 ${GIT_REPO_URL} -b ${GIT_BRANCH} /opt/opentosca-ui \
    && mvn package
	
FROM openjdk:8

ENV CATALINA_HOME /usr/local/tomcat

COPY --from=builder /opt/opentosca-ui/build/target /opt/opentosca-ui/build/target

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

CMD java -jar /opt/opentosca-ui/build/target/opentosca.war --server.port=8088
