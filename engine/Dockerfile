FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV ENGINE_BRANCH maven
ENV ENGINE_REV HEAD

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV HOME /root
WORKDIR ${HOME}

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:/opt/apache-maven-${MAVEN_VERSION}/bin/

# Replace /dev/random by /dev/urandom to avoid blocking
RUN rm /dev/random && ln -s /dev/urandom /dev/random

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y curl wget git openjdk-7-jdk && \
    apt-get clean -y
RUN wget ${MAVEN_URL} && \
    tar -zxf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    cp -R apache-maven-${MAVEN_VERSION} /opt

# Install Docker, partly from https://github.com/docker-library/docker/blob/master/1.12/Dockerfile
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 1.12.0
ENV DOCKER_SHA256 3dd07f65ea4a7b4c8829f311ab0213bca9ac551b5b24706f3e79a97e22097f8b
ENV DOCKER_COMPOSE_VERSION 1.8.0
RUN set -x && \
    curl -fSL "https://${DOCKER_BUCKET}/builds/Linux/x86_64/docker-${DOCKER_VERSION}.tgz" -o docker.tgz && \
    echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - && \
    tar -xzvf docker.tgz && \
    mv docker/* /usr/local/bin/ && \
    rmdir docker && \
    rm docker.tgz && \
    docker -v && \
    curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose && \
    docker-compose --version

# Install engine
RUN git clone --recursive https://github.com/OpenTOSCA/container.git -b ${ENGINE_BRANCH} /opt/engine
WORKDIR /opt/engine
RUN git checkout ${ENGINE_REV} && git reset --hard
RUN mvn clean package
#RUN mvn clean install
RUN ln -s /opt/engine/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA /usr/local/bin/opentosca-engine && \
    chmod +x /usr/local/bin/opentosca-engine

EXPOSE 1337

CMD [ "/usr/local/bin/opentosca-engine" ]
