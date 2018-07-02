
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Dockerized OpenTOSCA Environment

> Docker Compose file for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8088).

| OpenTOSCA Component | URL | GitHub | Docker Hub |
|:------------------- |:--- |:------ |:---------- |
| OpenTOSCA UI | http://localhost:8088 | [Link](https://github.com/OpenTOSCA/ui) | [Link](https://hub.docker.com/r/opentosca/ui) |
| OpenTOSCA Modelling (Eclipse Winery) | http://localhost:8080 | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| OpenTOSCA Container API | http://localhost:1337 | [Link](https://github.com/OpenTOSCA/container) | [Link](https://hub.docker.com/r/opentosca/container) |
| OpenTOSCA Container Repository | http://localhost:8081 | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| Plan Engine (Apache ODE or WSO2 BPS) | http://localhost:9763<br>(user: `admin`, password: `admin`) | [BPS](https://github.com/OpenTOSCA/bps) [ODE](https://github.com/OpenTOSCA/ode) | [BPS](https://hub.docker.com/r/opentosca/bps) [ODE](https://hub.docker.com/r/opentosca/ode) |
| IA Engine (Apache Tomcat) | http://localhost:8090/manager<br>(user: `admin`, password: `admin`) | [Link](https://github.com/OpenTOSCA/engine-ia) | [Link](https://hub.docker.com/r/opentosca/engine-ia) |

**Make sure following ports in your environment are free in order to start OpenTOSCA properly:**

* `1337`
* `8080-8088`
* `8090`
* `9763`
* `1883` (optional)

## How To ...

Simple How-To section to cover different kinds of use cases.

> **Info:** We use the override feature of Docker Compose to provide different configurations for certain use cases.
> [More information](https://docs.docker.com/compose/extends).
>
> A basic override file with common configuration settings for our environment:
> ```
> _docker-compose.override.yml
> ```
> Simply make a copy and modify it to your needs:
> ```
> cp _docker-compose.override.yml docker-compose.override.yml
> ```
> Settings from file `docker-compose.override.yml` are applied automatically when using `docker-compose up`.

### How to use an existing Winery repository?

You can map an existing Winery repository (on your host) as a volume into the `winery` container.

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Use the following configuration in order to map a repository:
```
  winery:
    volumes:
      - <path on host system>:/var/opentosca/repository
```
* Replace `<path on host system>` with the path to a valid Winery repository (can be empty)
* Start the environment as usual: `docker-compose up -d`

### How to run the environment with WSO2 BPS engine?

Start the environment with the `docker-compose.bps.yml` override:

```
docker-compose up -d -f docker-compose.yml -f docker-compose.bps.yml
```

### How to run the environment in production (Linux only)?

* Follow the installation instruction for Docker and Docker Compose (Linux):
    * <https://docs.docker.com/install/linux/docker-ce/ubuntu>
    * <https://docs.docker.com/compose/install>
* Create the following directories (required to map volumes properly):
```
mkdir -p /var/opentosca/container/data
mkdir -p /var/opentosca/container/repository
mkdir -p /var/opentosca/winery/repository
mkdir -p /var/opentosca/portainer
```
* Create a `.env` file and set the `PUBLIC_HOSTNAME` variable to your host's public IP address or hostname:
```
cat PUBLIC_HOSTNAME=`curl -s ifconfig.co` > .env
```
* Start the environment
```
docker-compose up -d -f docker-compose.yml -f docker-compose.prod.yml
```
* This setup also starts the lightweight management UI **Portainer** on port `9000`

### How to debug components running inside the environment?

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Make sure you enable and set the certain Java debug options (e.g., `-Xdebug`)
* Start the environment as usual: `docker-compose up -d`

## Tips and Tricks

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

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
