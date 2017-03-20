# Dockerized OpenTOSCA Environment

> Docker files for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    git clone https://github.com/OpenTOSCA/opentosca-dockerfiles.git && cd opentosca-dockerfiles
    docker-compose build
    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8080/opentosca).

| OpenTOSCA Component | URL |
| ------------------- | --- |
| OpenTOSCA UI | http://localhost:8080/opentosca |
| OpenTOSCA Container API | http://localhost:1337/containerapi |
| Winery | http://localhost:8080/winery |
| WSO2 BPS Engine | http://localhost:9763 |
| Apache Tomcat | http://localhost:8080 |

Have fun!
