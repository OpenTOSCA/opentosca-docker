FROM maven:3-jdk-8

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ENV OPENTOSCA_CONTAINER_BRANCH master
ENV OPENTOSCA_CONTAINER_REV HEAD

RUN rm /dev/random && ln -s /dev/urandom /dev/random

WORKDIR /opt/opentosca-container
RUN git clone --recursive https://github.com/OpenTOSCA/container.git -b ${OPENTOSCA_CONTAINER_BRANCH} /opt/opentosca-container \
    && git checkout ${OPENTOSCA_CONTAINER_REV} \
    && git reset --hard \
    && mvn clean package \
    && ln -s /opt/opentosca-container/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA /usr/local/bin/opentosca-container \
    && chmod +x /usr/local/bin/opentosca-container

EXPOSE 1337

CMD [ "/usr/local/bin/opentosca-container" ]
