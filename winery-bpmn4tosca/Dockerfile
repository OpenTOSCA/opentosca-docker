FROM node:6.10

LABEL maintainer "Oliver Kopp <kopp.dev@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ARG GIT_BRANCH=master

ENV CATALINA_HOME /usr/local/tomcat

WORKDIR /opt/bpmn4tosca
RUN git clone --recursive --depth=1 https://github.com/winery/BPMN4TOSCAModeler.git -b ${GIT_BRANCH} /opt/bpmn4tosca \
    && npm install -g grunt-cli \
    && npm install && grunt

CMD mkdir -p ${CATALINA_HOME}/webapps/bpmn4tosca && cp dist/* ${CATALINA_HOME}/webapps/bpmn4tosca
