
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Dockerized OpenTOSCA Environment

> Docker Compose file for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

    docker-compose up

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost:8088).

| OpenTOSCA Component | URL | GitHub | Docker Hub |
|:------------------- |:--- |:------ |:---------- |
| OpenTOSCA UI | <http://localhost><br><http://localhost:8088> | [Link](https://github.com/OpenTOSCA/ui) | [Link](https://hub.docker.com/r/opentosca/ui) |
| OpenTOSCA Modelling (Eclipse Winery) | <http://localhost/winery><br><http://localhost:8080> | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| OpenTOSCA Container API | <http://localhost:1337> | [Link](https://github.com/OpenTOSCA/container) | [Link](https://hub.docker.com/r/opentosca/container) |
| OpenTOSCA Container Repository | <http://localhost:8081> | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| Plan Engine (Apache ODE) | <http://localhost/ode><br><http://localhost:9763/ode> | [Link](https://github.com/OpenTOSCA/ode) | [Link](https://hub.docker.com/r/opentosca/ode) |
| IA Engine (Apache Tomcat) | <http://localhost/manager><br><http://localhost:8090/manager><br>(user: `admin`, password: `admin`) | [Link](https://github.com/OpenTOSCA/engine-ia) | [Link](https://hub.docker.com/r/opentosca/engine-ia) |

**Make sure following ports in your environment are free in order to start OpenTOSCA properly:**

* `1337`
* `8080-8088`
* `8090`
* `9763`
* `1883` (optional)
* `9000` (optional)

> It is recommended that your host or virtual machine has at least 4GB of memory.

**NOTE:** Please check the [Docker Daemon Settings](#docker-daemon-settings)

---

## How To

Simple How-To section to cover different kinds of use cases.

> **Info:** We use the override feature of Docker Compose to provide different configurations for certain use cases.
> [More information](https://docs.docker.com/compose/extends).
>
> Basic override file with common configuration settings for our environment: [`_docker-compose.override.yml`](_docker-compose.override.yml).
> Simply, make a copy and modify it to your needs:
> ```shell
> cp _docker-compose.override.yml docker-compose.override.yml
> ```
> Settings from `docker-compose.override.yml` are applied automatically when using `docker-compose up`.

### How to use an existing Winery repository

You can map an existing Winery repository (on your host) as a volume into the `winery` container.

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Use the following configuration in order to map a repository:

  ```yaml
    winery:
      volumes:
        - <path on host system>:/var/opentosca/repository
  ```

* Replace `<path on host system>` with the path to a valid Winery repository (can be empty)
* Start the environment as usual: `docker-compose up -d`

### How to run the environment with WSO2 BPS engine

Start the environment with the `docker-compose.bps.yml` override:

```shell
docker-compose -f docker-compose.yml -f docker-compose.bps.yml up -d
```

### How to run the environment in production (Linux only)

* Follow the installation instruction for Docker and Docker Compose (Linux):
  * [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu)
  * [Docker Compose](https://docs.docker.com/compose/install)
* Create the following directories (required to map volumes properly):

  ```shell
  mkdir -p /var/opentosca/container/data
  mkdir -p /var/opentosca/container/repository
  mkdir -p /var/opentosca/winery/repository
  mkdir -p /var/opentosca/portainer
  ```

* Open the `.env` file and set the `PUBLIC_HOSTNAME` variable to your host's public IP address or hostname
* Start the environment

  ```shell
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  ```

* This setup also starts the lightweight management UI **Portainer** on port `9000`
* For special scenarios, you may have to specify an override file:

  ```shell
  docker-compose.exe -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.override.yml up -d
  ```

### How to debug components running inside the environment

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Make sure you enable and set the certain Java debug options (e.g., `-Xdebug`)
* Start the environment as usual: `docker-compose up -d`

### How to use the environment for local development setups

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* For the `container` service, modify the port settings to avoid conflicts when starting the container from your IDE
* In addition, make sure to set the `PUBLIC_HOSTNAME` environment variable to your host's public IP address
* The final configuration for the `container` could look like the following:

  ```yaml
    container:
      ports:
        - '11337:1337'
      environment:
        PUBLIC_HOSTNAME: 129.69.214.56
  ```

* Start the environment as usual: `docker-compose up -d`
* Afterwards, you are able to run the container via Eclipse (using a modified configuration matching your needs)
* You should be able to use the `MyTinyTodo_Bare_Docker.csar` using the following provisioning parameters:
  * Application Port: `9990`
  * DockerEngineURL: `tcp://dind:2375`
* Finally, you can launch the application on <http://localhost:9990>

### How to clone a private TOSCA definitions repository to be used with Winery

* Start the environment as usual: `docker-compose up -d`

* Log in to the Winery container and clone the respective Git repository manually (we use our internal `tosca-definitions-internal` repo as an example here):

  ```shell
  docker-compose exec winery bash
  rm -rf /var/opentosca/repository
  git clone https://github.com/OpenTOSCA/tosca-definitions-internal /var/opentosca/repository
  exit
  ```

* Open Winery at <http://localhost:8080>
  > **Note:** Changes to the repository has to be pushed manually with `git push`.

### How to extend Winery's JVM Heap Size

You can adjust Winery's JVM heap size by setting a respective environment variable for the `winery` container.

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Use the following configuration in order to map a repository:

  ```yaml
    winery:
      environment:
        WINERY_HEAP_MAX: 8192m
  ```

* **Note:** Make sure the hosting VM has enough capacity
* Start the environment as usual: `docker-compose up -d`

### Tips and Tricks

#### General

```bash
# Pull the latest images
docker-compose pull

# Validate and view the resulting configuration
docker-compose [-f <file> ...] config

# Start services in background
docker-compose up -d

# Shutdown services and remove container
docker-compose down -v

# Display useful logs
docker-compose logs -f [--tail=1 <SERVICE_NAME>...]
docker-compose logs -f container
docker-compose logs -f engine-ia engine-plan
```

#### Docker Daemon Settings

For a good user experience set up your docker environment accordingly:

![Docker MAC Seetings](docs/docker_daemon.png)

---

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
