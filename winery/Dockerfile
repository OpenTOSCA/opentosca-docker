FROM maven:3-jdk-8

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ENV WINERY_BRANCH master
ENV WINERY_REV HEAD

ENV CATALINA_HOME /usr/local/tomcat

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -y \
    && apt-get install -y nodejs \
    && apt-get clean -y \
    && echo '{ "allow_root": true }' > /root/.bowerrc \
    && npm install -g bower

WORKDIR /opt/winery
RUN git clone --recursive https://github.com/eclipse/winery.git -b ${WINERY_BRANCH} /opt/winery \
    && git checkout ${WINERY_REV} \
    && git reset --hard \
    && mvn clean package

CMD cp /opt/winery/org.eclipse.winery.repository/target/winery.war ${CATALINA_HOME}/webapps && \
    cp /opt/winery/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war ${CATALINA_HOME}/webapps
