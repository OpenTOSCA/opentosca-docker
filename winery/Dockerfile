FROM maven:3-jdk-8 as winery_builder

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ENV TOMCAT_USERNAME admin
ENV TOMCAT_PASSWORD admin

ARG NAME=winery

#Winery Git Repository details
ARG GIT_REPO_URL=https://github.com/OpenTOSCA/winery.git
ARG GIT_BRANCH=master

#CSAR repository Information
ARG CSAR_GIT_REPO_HOST
ARG CSAR_GIT_REPO_USER
ARG CSAR_GIT_REPO_PW

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
        unzip \
    && rm -rf /var/lib/apt/lists/* \
    && echo '{ "allow_root": true }' > /root/.bowerrc \
    && npm install -g bower

WORKDIR /opt/
RUN git clone --recursive --depth=1 ${GIT_REPO_URL} -b ${GIT_BRANCH} /opt/${NAME} && cd ${NAME} \
    && mvn package
	
# Injecting base URL for BPMN4TOSCA Modeler
RUN mkdir -p /tmp/${NAME} \
	&& apt-get update -qq && apt-get install -qqy \
        unzip \
    && unzip /opt/${NAME}/org.eclipse.winery.repository/target/winery.war -d /tmp/${NAME} \
    && unzip /opt/${NAME}/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war -d /tmp/winery-topologymodeler \
    && sed -i "sXbpmn4toscamodelerBaseURI=.*Xbpmn4toscamodelerBaseURI=http://${REMOTE_HOSTNAME}:8080/bpmn4toscaX" /tmp/${NAME}/WEB-INF/classes/winery.properties \
    && sed -i "sX#repositoryPath=.*XrepositoryPath=/var/opentosca_repository/${NAME}-csar-repositoryX" /tmp/${NAME}/WEB-INF/classes/winery.properties
	
FROM node:6.10 as bpmn4tosca_builder

LABEL maintainer "Oliver Kopp <kopp.dev@gmail.com>, Michael Wurster <miwurster@gmail.com>"

#BPPMN4TOSCAModeler Git Repository details
ARG GIT_REPO_URL=https://github.com/winery/BPMN4TOSCAModeler.git
ARG GIT_BRANCH=master

WORKDIR /opt/
RUN git clone --recursive --depth=1 ${GIT_REPO_URL} -b ${GIT_BRANCH} /opt/bpmn4tosca \
    && cd /opt/bpmn4tosca \
    && npm install -g grunt-cli \
    && npm install && grunt
	
FROM openjdk:8 as repository_builder

WORKDIR /opt/

# fetch (if configured) csar repository
RUN if [ ! -z ${CSAR_GIT_REPO_USER} ] && [ ! -z ${CSAR_GIT_REPO_HOST} ] ; then \
       git clone --recursive https://${CSAR_GIT_REPO_USER}:${CSAR_GIT_REPO_PW}@${CSAR_GIT_REPO_HOST} /opt/${NAME}-csar-repository ;\
    else \
      echo "No private CSAR Repository specified" ; \
    fi

RUN if [ -z ${CSAR_GIT_REPO_USER} ] && [ ! -z ${CSAR_GIT_REPO_HOST} ] ; then \
       git clone --recursive ${CSAR_GIT_REPO_HOST} /opt/${NAME}-csar-repository ; \
    else \
      echo "No public CSAR Repository specified" ; \
    fi

#We create this directory here because we are using this to copy the  files to the final image
#If this directory doesn't exist in the current intermediate image, the build fails in the final image
RUN mkdir -p /opt/opentosca_repository
	
CMD if [ ! -z ${CSAR_GIT_REPO_HOST} ] ; then cp -r /opt/${NAME}-csar-repository /opt/opentosca_repository/ ; fi
	
FROM tomcat:8.0.20-jre8

COPY --from=winery_builder /tmp/${NAME} ${CATALINA_HOME}/webapps/${NAME}
COPY --from=winery_builder /tmp/winery-topologymodeler ${CATALINA_HOME}/webapps/winery-topologymodeler
COPY --from=bpmn4tosca_builder /opt/bpmn4tosca/dist ${CATALINA_HOME}/webapps/bpmn4tosca
COPY --from=repository_builder /opt/opentosca_repository/ /var/opentosca_repository/

EXPOSE 8080
	
CMD ${CATALINA_HOME}/bin/catalina.sh run
