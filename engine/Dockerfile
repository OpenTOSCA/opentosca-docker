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
    apt-get install -y wget git openjdk-7-jdk && \
    apt-get clean -y
RUN wget ${MAVEN_URL} && \
    tar -zxf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    cp -R apache-maven-${MAVEN_VERSION} /opt

# Install engine
RUN git clone --recursive https://github.com/OpenTOSCA/container.git -b ${ENGINE_BRANCH} /opt/engine
WORKDIR /opt/engine
RUN git checkout ${ENGINE_REV} && git reset --hard
RUN mvn clean package
#RUN mvn clean install
RUN chmod +x /opt/engine/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA
RUN ln -s /opt/engine/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA /usr/local/bin/opentosca-engine

EXPOSE 1337

CMD [ "/usr/local/bin/opentosca-engine" ]
