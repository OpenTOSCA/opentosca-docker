# Dockerized OpenTOSCA Environment

> Docker files for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    git clone https://github.com/OpenTOSCA/opentosca-dockerfiles.git && cd opentosca-dockerfiles
    docker-compose build
    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8080/opentosca).

| OpenTOSCA Component | URL |
|:------------------- |:--- |
| OpenTOSCA UI | http://localhost:8088 |
| OpenTOSCA Container API | http://localhost:1337 |
| OpenTOSCA Container Repository | http://localhost:8080/containerrepository |
| OpenTOSCA Winery | http://localhost:8080/winery |
| WSO2 BPS Engine | http://localhost:9763 |
| Apache Tomcat | http://localhost:8080 |

Have fun!

---

### Tipps and Tricks

```bash
# Shutdown services and remove container
docker-compose down -v --remove-orphans

# Re-build OpenTOSCA components (for development purposes)
docker-compose build --force-rm --no-cache opentosca-container opentosca-ui containerrepository winery

# Display useful logs
docker-compose logs -f opentosca-container
docker-compose logs -f tomcat bps
```
