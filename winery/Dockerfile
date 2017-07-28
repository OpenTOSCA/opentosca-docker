FROM maven:3-jdk-8

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ARG GIT_REPO_URL=https://github.com/OpenTOSCA/winery.git
ARG GIT_BRANCH=master
ARG NAME=winery
ARG CSAR_GIT_REPO_HOST
ARG CSAR_GIT_REPO_USER
ARG CSAR_GIT_REPO_PW

ENV REMOTE_HOSTNAME localhost

ENV CATALINA_HOME /usr/local/tomcat

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
    && unzip /opt/${NAME}/org.eclipse.winery.repository/target/winery.war -d /tmp/${NAME} \
    && unzip /opt/${NAME}/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war -d /tmp/winery-topologymodeler \
    && sed -i "sXbpmn4toscamodelerBaseURI=.*Xbpmn4toscamodelerBaseURI=http://${REMOTE_HOSTNAME}:8080/bpmn4toscaX" /tmp/${NAME}/WEB-INF/classes/winery.properties \
    && sed -i "sX#repositoryPath=.*XrepositoryPath=/opt/${NAME}-csar-repositoryX" /tmp/${NAME}/WEB-INF/classes/winery.properties

# fetch (if configured) csar repository
RUN if [ ! -z ${CSAR_GIT_REPO_USER} ] && [ ! -z ${CSAR_GIT_REPO_HOST} ] ; then \
       git clone --recursive https://${CSAR_GIT_REPO_USER}:${CSAR_GIT_REPO_PW}@${CSAR_GIT_REPO_HOST} /tmp/${NAME}-csar-repository ;\
    else \
      echo "No private CSAR Repository specified" ; \
    fi

RUN if [ -z ${CSAR_GIT_REPO_USER} ] && [ ! -z ${CSAR_GIT_REPO_HOST} ] ; then \
       git clone --recursive ${CSAR_GIT_REPO_HOST} /tmp/${NAME}-csar-repository ; \
    else \
      echo "No public CSAR Repository specified" ; \
    fi

CMD cp -r /tmp/${NAME} ${CATALINA_HOME}/webapps/ && \
    cp -r /tmp/winery-topologymodeler ${CATALINA_HOME}/webapps/ && \
    if [ ! -z ${CSAR_GIT_REPO_HOST} ] ; then cp -r /tmp/${NAME}-csar-repository /opt/ ; fi
