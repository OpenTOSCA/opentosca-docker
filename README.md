# opentosca-dockerfiles

Dockerfiles for running the entire OpenTOSCA stack.

The fastest way to get started is using [docker-compose](https://docs.docker.com/compose/):

    git clone https://github.com/jojow/opentosca-dockerfiles.git
    cd opentosca-dockerfiles
    docker-compose up

Wait a few seconds, then open:

    http://<HOST>:8080

You can also run a subset of the OpenTOSCA stack, for example, if you only need Winery:

    docker-compose up winery

Have fun!
