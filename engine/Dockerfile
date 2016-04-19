FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV CONTAINER_BRANCH maven
ENV CONTAINER_REV HEAD

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV HOME /root
WORKDIR ${HOME}

ENV DEBIAN_FRONTEND noninteractive
ENV PATH ${PATH}:/opt/apache-maven-${MAVEN_VERSION}/bin/

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y wget git openjdk-7-jdk && \
    apt-get clean -y
RUN wget ${MAVEN_URL} && \
    tar -zxf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    cp -R apache-maven-${MAVEN_VERSION} /opt

# Install container
WORKDIR /opt
RUN git clone --recursive https://github.com/OpenTOSCA/container.git -b ${CONTAINER_BRANCH}
WORKDIR /opt/container
RUN git checkout ${CONTAINER_REV} && git reset --hard
RUN mvn clean package
#RUN mvn clean install
RUN chmod +x /opt/container/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA
RUN ln -s /opt/container/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA /usr/local/bin/opentosca-container

EXPOSE 1337

CMD [ "/usr/local/bin/opentosca-container" ]

#
# docker build -t opentosca/container-engine .
# docker run -d -p 1337:1337 opentosca/container-engine
#
