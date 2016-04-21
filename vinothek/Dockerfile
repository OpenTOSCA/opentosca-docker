FROM ubuntu:14.04

MAINTAINER Johannes Wettinger, http://github.com/jojow

ENV ENGINE_HOSTNAME localhost
ENV ENGINE_HOSTNAME_INTERNAL localhost
ENV ENGINE_PORT 1337

ENV MAVEN_VERSION 3.3.9
ENV MAVEN_URL http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV TOMCAT_HOME /opt/tomcat

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

# Install vinothek
RUN git clone https://github.com/OpenTOSCA/vinothek.git /opt/vinothek
WORKDIR /opt/vinothek
#RUN mvn clean package

#CMD cp /opt/vinothek/target/vinothek.war $TOMCAT_HOME/webapps



# Workaround
CMD sed -i "s/containerHost = split\[0\]/containerHost = \"$ENGINE_HOSTNAME_INTERNAL\"/g" src/main/java/org/opentosca/ui/vinothek/VinothekContainerClient.java && \
    sed -i "s/containerHost = containerTmp/containerHost = \"$ENGINE_HOSTNAME_INTERNAL\"/g" src/main/java/org/opentosca/ui/vinothek/VinothekContainerClient.java && \
    sed -i "s/containerPort = Integer.parseInt(split\[1\])/containerPort = $ENGINE_PORT/g" src/main/java/org/opentosca/ui/vinothek/VinothekContainerClient.java && \
    \
    sed -i "s/<%=client.getContainerHost()%>/$ENGINE_HOSTNAME/g" src/main/webapp/RenderedApplicationIconBox.jsp && \
    sed -i "s/<%=client.getContainerHost()%>/$ENGINE_HOSTNAME/g" src/main/webapp/ApplicationList.jsp && \
    sed -i "s/<%=client.getContainerHost()%>/$ENGINE_HOSTNAME/g" src/main/webapp/ApplicationElement.jsp && \
    \
    sed -i "s/getImageUrl())/getImageUrl()).replace(\":\/\/$ENGINE_HOSTNAME_INTERNAL\", \":\/\/$ENGINE_HOSTNAME\")/g" src/main/webapp/ApplicationElement.jsp && \
    sed -i "s/getIconUrl())/getIconUrl()).replace(\":\/\/$ENGINE_HOSTNAME_INTERNAL\", \":\/\/$ENGINE_HOSTNAME\")/g" src/main/webapp/ApplicationElement.jsp && \
    sed -i "s/getIconUrl())/getIconUrl()).replace(\":\/\/$ENGINE_HOSTNAME_INTERNAL\", \":\/\/$ENGINE_HOSTNAME\")/g" src/main/webapp/RenderedApplicationIconBox.jsp && \
    \
    mvn -q clean package && \
    \
    cp /opt/vinothek/target/vinothek.war $TOMCAT_HOME/webapps
