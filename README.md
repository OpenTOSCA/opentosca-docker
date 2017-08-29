
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Dockerized OpenTOSCA Environment

> Docker Compose file for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8088).

| OpenTOSCA Component | URL | GitHub | Docker Hub |
|:------------------- |:--- |:------ |:---------- |
| OpenTOSCA UI | http://localhost:8088 | [Link](https://github.com/OpenTOSCA/ui) | [Link](https://hub.docker.com/r/opentosca/ui) |
| OpenTOSCA Modelling (Eclipse Winery™) | http://localhost:8080 | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| OpenTOSCA Container API | http://localhost:1337 | [Link](https://github.com/OpenTOSCA/container) | [Link](https://hub.docker.com/r/opentosca/container) |
| OpenTOSCA Container Repository | http://localhost:8081 | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| Plan Engine (WSO2 BPS) | http://localhost:9763<br>(user: `admin`, password: `admin`) | [Link](https://github.com/OpenTOSCA/engine-plan) | [Link](https://hub.docker.com/r/opentosca/engine-plan) |
| IA Engine (Apache Tomcat) | http://localhost:8090/manager<br>(user: `admin`, password: `admin`) | [Link](https://github.com/OpenTOSCA/engine-ia) | [Link](https://hub.docker.com/r/opentosca/engine-ia) |

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

---

### Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

### Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
