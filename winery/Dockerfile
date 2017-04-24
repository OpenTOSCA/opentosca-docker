FROM maven:3-jdk-8

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ARG GIT_BRANCH=master

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

WORKDIR /opt/winery
RUN git clone --recursive --depth=1 https://github.com/eclipse/winery.git -b ${GIT_BRANCH} /opt/winery \
    && mvn package

# Injecting base URL for BPMN4TOSCA Modeler
RUN mkdir -p /tmp/winery \
    && unzip /opt/winery/org.eclipse.winery.repository/target/winery.war -d /tmp/winery \
    && sed -i "sXbpmn4toscamodelerBaseURI=.*Xbpmn4toscamodelerBaseURI=http://${REMOTE_HOSTNAME}:8080/bpmn4toscaX" /tmp/winery/WEB-INF/classes/winery.properties

CMD cp -r /tmp/winery ${CATALINA_HOME}/webapps/ && \
    cp /opt/winery/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war ${CATALINA_HOME}/webapps
