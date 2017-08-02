# Dockerized OpenTOSCA Environment

> Docker files for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    git clone https://github.com/OpenTOSCA/opentosca-dockerfiles.git && cd opentosca-dockerfiles
    docker-compose build
    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8088).

| OpenTOSCA Component | URL |
|:------------------- |:--- |
| OpenTOSCA UI | http://localhost:8088 |
| OpenTOSCA Container API | http://localhost:1337 |
| OpenTOSCA Container Repository | http://localhost:8081/winery |
| OpenTOSCA Modelling (Eclipse Winery™) | http://localhost:8090/winery |
| Plan Engine (WSO2 BPS) | http://localhost:9763 |
| IA Engine (Apache Tomcat) | http://localhost:8080 |

Have fun!

---

### Tipps and Tricks

```bash
# Start services in background
docker-compose up -d

# Shutdown services and remove container
docker-compose down -v

# Re-build OpenTOSCA components (for development purposes)
docker-compose build --force-rm [--no-cache [<SERVICE_NAME>...]]
docker-compose build --force-rm --no-cache container container-repository web

# Display useful logs
docker-compose logs -f [--tail=1 <SERVICE_NAME>...]
docker-compose logs -f container
docker-compose logs -f engine-ia engine-plan
```
