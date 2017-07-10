FROM maven:3-jdk-8 as builder

LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ARG GIT_BRANCH=master

RUN rm /dev/random && ln -s /dev/urandom /dev/random

WORKDIR /opt/opentosca-container
RUN git clone --recursive --depth=1 https://github.com/OpenTOSCA/container.git -b ${GIT_BRANCH} /opt/opentosca-container \
    && mvn package

FROM alpine:latest  

COPY --from=builder /opt/opentosca-container/org.opentosca.container.product/target/products/org.opentosca.container.product/linux/gtk/x86_64/OpenTOSCA .

RUN ln ./OpenTOSCA /usr/local/bin/opentosca-container \
    && chmod +x /usr/local/bin/opentosca-container

EXPOSE 1337

CMD [ "/usr/local/bin/opentosca-container" ]
