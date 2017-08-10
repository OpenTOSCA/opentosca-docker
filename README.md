
# Dockerized OpenTOSCA Environment

> Docker Compose file for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8088).

| OpenTOSCA Component | URL | GitHub | Docker Hub |
|:------------------- |:--- |:------ |:---------- |
| OpenTOSCA UI | http://localhost:8088 | [Link](https://github.com/OpenTOSCA/ui) | [Link](https://hub.docker.com/r/opentosca/ui) |
| OpenTOSCA Container API | http://localhost:1337 | [Link](https://github.com/OpenTOSCA/container) | [Link](https://hub.docker.com/r/opentosca/container) |
| OpenTOSCA Container Repository | http://localhost:8081 | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| OpenTOSCA Modelling UI (Eclipse Winery™) | http://localhost:8090 | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| OpenTOSCA Modelling API (Eclipse Winery™) | http://localhost:8090/winery | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| Plan Engine (WSO2 BPS) | http://localhost:9763 | [Link](https://github.com/OpenTOSCA/engine-plan) | [Link](https://hub.docker.com/r/opentosca/engine-plan) |
| IA Engine (Apache Tomcat) | http://localhost:8080 | [Link](https://github.com/OpenTOSCA/engine-ia) | [Link](https://hub.docker.com/r/opentosca/engine-ia) |

Have fun!

---

### Tipps and Tricks

```bash
# Pull the latest images
docker-compose pull

# Start services in background
docker-compose up -d

# Shutdown services and remove container
docker-compose down -v

# Display useful logs
docker-compose logs -f [--tail=1 <SERVICE_NAME>...]
docker-compose logs -f container
docker-compose logs -f engine-ia engine-plan
```
