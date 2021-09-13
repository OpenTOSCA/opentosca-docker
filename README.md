
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Dockerized OpenTOSCA Environment

> Docker Compose file for running the entire OpenTOSCA stack.

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

* Create a `.env` file by coping it from `_.env`
* Add your publicly available FQDN or IP address to the `PUBLIC_HOSTNAME` variable in the `.env` file and save it
* Execute the following command:

  ```shell
  docker-compose up
  ```

Wait a few seconds, then open the [OpenTOSCA user interface](http://localhost).

More useful commands can be found in section [Useful Commands](#useful-commands).


## Short Container Overview

A more detailed overview can be found in the [docs folder](./docs/container-overview.md).

| OpenTOSCA Component | URL | GitHub | Docker Hub |
|:------------------- |:--- |:------ |:---------- |
| OpenTOSCA UI | <http://localhost><br><http://localhost:8088> | [Link](https://github.com/OpenTOSCA/ui) | [Link](https://hub.docker.com/r/opentosca/ui) |
| OpenTOSCA Modelling (Eclipse Winery) | <http://localhost/winery><br><http://localhost:8080> | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| OpenTOSCA Container API | <http://localhost:1337> | [Link](https://github.com/OpenTOSCA/container) | [Link](https://hub.docker.com/r/opentosca/container) |
| OpenTOSCA Container Repository | <http://localhost:8081> | [Link](https://github.com/OpenTOSCA/winery) | [Link](https://hub.docker.com/r/opentosca/winery) |
| Plan Engine BPEL (Apache ODE) | <http://localhost/ode><br><http://localhost:9763/ode> | [Link](https://github.com/OpenTOSCA/ode) | [Link](https://hub.docker.com/r/opentosca/ode) |
| Plan Engine BPMN (Camunda) | <http://localhost/camunda><br><http://localhost:8092/camunda> | [Link](https://github.com/OpenTOSCA/camunda-bpmn) | [Link](https://hub.docker.com/r/opentosca/camunda-bpmn) |
| IA Engine (Apache Tomcat) | <http://localhost/manager><br><http://localhost:8090/manager><br>(user: `admin`, password: `admin`) | [Link](https://github.com/OpenTOSCA/engine-ia) | [Link](https://hub.docker.com/r/opentosca/engine-ia) |

**Make sure following ports in your environment are free in order to start OpenTOSCA properly:**

* `1337`
* `8080-8088`
* `8090`
* `8091`
* `8092`
* `9763`
* `1883`
* `9000` (optional)

> It is recommended that your host or virtual machine has at least 4GB of memory.

**NOTE:** Please check the [Docker Daemon Settings](#docker-daemon-settings)

---


## Deployment

The steps to deploy OpenTOSCA in production can be found in [docs/production.md](./docs/production.md)


## How-To Guides for Developers (and Advanced Users)

How-Tos explaining how to realize specific scenarios can be found in [docs/advanced-how-to.md](./docs/advanced-how-to.md)

* [How to use an existing **local** Winery repository](./docs/advanced-how-to.md#how-to-use-an-existing-local-winery-repository)
* [How to use an existing **public git** Winery repository](./docs/advanced-how-to.md#how-to-use-an-existing-public-git-winery-repository)
* [How to run the environment with WSO2 BPS engine](./docs/advanced-how-to.md#how-to-run-the-environment-with-wso2-bps-engine)
* [How to debug components running inside the environment](./docs/advanced-how-to.md#how-to-debug-components-running-inside-the-environment)
* [How to clone a **private** TOSCA definitions repository to be used with Winery](./docs/advanced-how-to.md#how-to-clone-a-private-tosca-definitions-repository-to-be-used-with-winery)
* [How to extend Winery's JVM Heap Size](./docs/advanced-how-to.md#how-to-extend-winery's-jvm-heap-size)


## Tips and Tricks

### Useful Commands

In most cases starting the containers in the background and attaching to the log of select containers in different terminals will provide the best experience.

```bash
# Start services in background
docker-compose up -d

# Attach to container log in first terminal
docker-compose logs -f container

# Attach to engine logs in second terminal
docker-compose logs -f engine-ia engine-plan

# Shutdown services
docker-compose down
```

To pull the latest images and ensure that they are run remove the existing containers at shutdown:

```bash
# Shutdown services and remove container
docker-compose down -v

# Pull the latest images
docker-compose pull
```

Other useful commands:

```bash
# Validate and view the resulting configuration
docker-compose [-f <file> ...] config

# Display useful logs
docker-compose logs -f [--tail=1 <SERVICE_NAME>...]
docker-compose logs -f container
docker-compose logs -f engine-ia engine-plan
```


## Troubleshooting

### Not enough RAM for the Docker Daemon?

The OpenTOSCA environment needs about 6GB of RAM to run smoothly.
For a good user experience set up your Docker environment accordingly:

![Docker MAC Seetings](docs/docker_daemon.png)

### Slow Startup of some Containers

On some linux systems the following problem arises: https://stackoverflow.com/questions/27612209/spring-boot-application-wont-boot-at-startup-inside-docker

The easiest way right now to fix it is the following: ```bash apt-get install haveged -y```

### Some containers immediately crash after starting the environment.
​
The amount of RAM that Docker is allowed to use is probably too small.

=> See [Not enough RAM for the Docker Daemon?](#not-enough-ram-for-the-docker-daemon)
​
### StackOverflow exception in the engine-plan container
​
This is usually a problem with the configured stack size in Java.
You can try to fix it by allowing the Java runtime in the container to use more space.
Therefore, add the following lines to your `docker-compose.override` file:
​
```yaml
  engine-plan:
    environment:
      _JAVA_OPTIONS: "-Xmx3048m -Xms512m -Xss4m"
```
​
:warning: The underscore in front of the variable name is important. If it is missing, the override does not work!

### Networking troubles

Make sure that the `PUBLIC_HOSTNAME` environemnt variable is set and points to your local machine running the docker-compose file.
Test if you can reach the open ports of all containers with that address.
See [Container Overview](./docs/container-overview.md) for a more detailed description of the container ports and dependencies between containers.
See also [About the Network](./docs/container-overview.md#about-the-network) for background information of the bridge network setup in the docker compose file.



---



## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
