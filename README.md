
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Dockerized OpenTOSCA Environment

> Docker Compose file for running the entire OpenTOSCA stack.

:warning: On newer docker installations `docker-compose` will be integrated into the docker cmd. If this is the case then all `docker-compose` commands must be written as `docker compose` (without the hyphen)! (See [Compose V2 and the new docker compose command](https://docs.docker.com/compose/cli-command/#compose-v2-and-the-new-docker-compose-command))

The fastest way to get started is using [Docker Compose](https://docs.docker.com/compose/):

* **IMPORTANT**: Ensure that you have logged in to the GitHub Container Registry.
  * Follow the steps described here: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic
* Create a `.env` file by coping it from `_.env`
* Add your publicly available FQDN or IP address to the `PUBLIC_HOSTNAME` variable in the `.env` file and save it\
  (see also [I don't know my public IP](#i-don't-know-my-public-ip))
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
| IA Engine (Apache Tomcat) | <http://localhost/manager><br><http://localhost:8090/manager> (based on Java 8)<br><http://localhost:8093/manager> (based on Java 17)<br>(user: `admin`, password: `admin`) | [Link](https://github.com/OpenTOSCA/engine-ia) | [Link](https://hub.docker.com/r/opentosca/engine-ia) |

**Make sure following ports in your environment are free in order to start OpenTOSCA properly:**

* `1337`
* `1883`
* `8080-8088`
* `8090`
* `8091`
* `8092`
* `8093`
* `9763`
* `3000` (optional grafana server)
* `3100` (optional loki server)
* `9000` (optional)
* `9990-9999` (optional, used as application ports in DIND deployments)

> It is recommended that your host or virtual machine has at least 4GB of memory.

**NOTE:** Please check the [Docker Daemon Settings](#docker-daemon-settings)

---


## Deployment

The steps to deploy OpenTOSCA in production can be found in [docs/production.md](./docs/production.md)


## How-To Guides for Developers (and Advanced Users)

How-Tos explaining how to realize specific scenarios can be found in [docs/advanced-how-to.md](./docs/advanced-how-to.md)

* [How to configure the OpenTOSCA UI to use a different Winery repository](./docs/advanced-how-to.md#how-to-configure-the-opentosca-ui-to-use-a-different-winery-repository)
* [How to use an existing **local** Winery repository](./docs/advanced-how-to.md#how-to-use-an-existing-local-winery-repository)
* [How to use an existing **public git** Winery repository](./docs/advanced-how-to.md#how-to-use-an-existing-public-git-winery-repository)
* [How to run the environment with WSO2 BPS engine](./docs/advanced-how-to.md#how-to-run-the-environment-with-wso2-bps-engine)
* [How to debug components running inside the environment](./docs/advanced-how-to.md#how-to-debug-components-running-inside-the-environment)
* [How to clone a **private** TOSCA definitions repository to be used with Winery](./docs/advanced-how-to.md#how-to-clone-a-private-tosca-definitions-repository-to-be-used-with-winery)
* [How to extend Winery's JVM Heap Size](./docs/advanced-how-to.md#how-to-extend-winery's-jvm-heap-size)
* [How to access logs using the Browser](./docs/advanced-how-to.md#how-to-access-logs-using-the-browser)


## Tips and Tricks

### Useful Commands

:warning: New installations of `docker-compose` are integrated into the `docker` command and must be run as `docker compose` (without the hyphen)!  (See [Compose V2 and the new docker compose command](https://docs.docker.com/compose/cli-command/#compose-v2-and-the-new-docker-compose-command))

In most cases starting the containers in the background and attaching to the log of select containers in different terminals will provide the best experience.

```bash
# Start services in background
docker-compose up -d

# Attach to container log in first terminal
docker-compose logs -f container

# Attach to engine logs in second terminal
docker-compose logs -f engine-ia-jdk17 engine-plan-bpel

# Or attach to engine logs for legacy IAs
docker-compose logs -f engine-ia-jdk8 engine-plan-bpel

# Shutdown services
docker-compose down
```

To pull the latest images and ensure that they are run remove the existing containers at shutdown:

```bash
# Shutdown services and remove container
docker-compose down -v

# Shutdown services and remove containers (including containers from unspecified services)
docker-compose down -v --remove-orphans

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
docker-compose logs -f engine-ia-jdk8 engine-ia-jdk17 engine-plan-bpel
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
### StackOverflow exception in the engine-plan-bpel container
​
This is usually a problem with the configured stack size in Java.
You can try to fix it by allowing the Java runtime in the container to use more space.
Therefore, add the following lines to your `docker-compose.override` file:
​
```yaml
  engine-plan-bpel:
    environment:
      _JAVA_OPTIONS: "-Xmx3048m -Xms512m -Xss4m"
```
​
:warning: The underscore in front of the variable name is important. If it is missing, the override does not work!

### The Winery CSAR Repository does not work Correctly (missing `git-lfs`)

The git repositories used by winery use [`git lfs`](https://git-lfs.github.com/) as they contain large binary files which are not checked in to the git tree.
This can be a problem if you use a locally installed Winery or have mapped existing git repositories into the Winery container.

To install `git lfs` follow these steps:

  1. Install `git lfs` on your machine (see the `git lfs` [homepage](https://git-lfs.github.com/) or the [wiki](https://github.com/git-lfs/git-lfs/wiki/Installation))
  2. run `git lfs install` in all git repositories used by your Winery (first `cd` into the git repository)
  3. run `git lfs pull` to download the binary files

⚠️ If the lfs-files are not downloaded, the repository, and thus the modeled applications, cannot run! 
Thus, ensure you run `git lfs pull` in every repository used by your Winery.

💡 To install git lfs globally, run `git lfs install --system`. 
This makes git lfs automatically available for all repositories and you do not have to run git lfs pull yourself.
This **only** works for newly cloned git repositories so make sure to check all existing repositories manually.

### I don't know my public IP

**Windows:** Open a command line and type `ipconfig` then search for the IPv4 or IPv6 address of the wlan or ethernet adapter currently in use.
If you know the hostname of your machine you can also try `ping yourHostnameHere` or `ping yourHostnameHere.local` to get the IP.
To get the hostname use the command `hostname`.
To get all IP addresses known for the hostname try `nslookup yourHostnameHere`.

**Mac:** The IP address can be found in the "System Preferences" under "Network".
Options with a green dot are active and should have an IP address that can be found by selecting the option, then clicking "Advanced" and opening the "TCP/IP" tab.
Alternatively use the command `ifconfig` in the shell and look for `inet` or `inet6` addresses for the ethernet or wlan interfaces in use.

**Linux:** Use the command `ip addr show` (or shorter `ip a s`) in a shell to list the IP addresses of all available interfaces and look for `inet` or `inet6` addresses for the ethernet or wlan interface(s).
On older linux systems where this command is not available use `ifconfig` instead.
If you know the hostname of your machine you can also try `host yourHostnameHere` or `host yourHostnameHere.local` to get the IP.
To get the hostname use the command `hostname`.

If you are unsure which IP to choose, start with one, run the docker-compose and test with which IPs both the OpenTOSCA UI and the Winery can be reached.
Use the IP address that reaches both.

:warning: Do **not** use the addresses `127.0.0.1` or `::1:` as these are special addresses (local loopback).

:warning: If you want to use an IPv6 Address in the address line of your browser, then you need to enclose the Address in `[]` (e.g. `[2607:f0d0:1002:51::4]` or `[2607:f0d0:1002:0051:0000:0000:0000:0004]`). Do not use `[]` in the `PUBLIC_HOSTNAME` environemnt variable!

### Networking Problems

Make sure that the `PUBLIC_HOSTNAME` environemnt variable is set and points to your local machine running the docker-compose file.
Test if you can reach the open ports of all containers with that address.
See [Container Overview](./docs/container-overview.md) for a more detailed description of the container ports and dependencies between containers.
See also [About the Network](./docs/container-overview.md#about-the-network) for background information of the bridge network setup in the docker compose file.

Windows and Mac users may use `host.docker.internal` as `PUBLIC_HOSTNAME` if all containers are started locally in docker-compose.
This will **not** work for development setups where some parts of OpenTOSCA are started outside of the docker-compose network!
Mac users need to apply a workaround described in [About the Network](./docs/container-overview.md#about-the-network) for this to work.

In rare cases the port `8080` of the `winery` container may be inaccessible.
In these cases it may help to change the port in the docker-compose file (e.g. to `8079:8080` [`<outside-port>:<container-port>`]) and use the config options described in [How to configure the OpenTOSCA UI to use a different Winery repository](./docs/advanced-how-to.md#how-to-configure-the-opentosca-ui-to-use-a-different-winery-repository) to point the OpenTOSCA ui to the new port for the Winery.

### Http Certificates Cannot be Validated / Clocks Out of Sync / `apt update` fails

```text
$ sudo apt update
…
Reading package lists... Done
E: Release file for http://us.archive.ubuntu.com/ubuntu/dists/bionic-updates/InRelease is not valid yet (invalid for another 4h 34min 33s). Updates for this repository will not be applied.
…
```

Most noticable is the `apt update` command failing with errors like "Release file is not yet valid".
This can happen if the clock of the system is out of sync with the rest of the internet.
Check the current date-time by calling `date` in the affected systems console.

**WSL2:** Linux running on the WSL2 can get out of sync if the windows host went into sleep.
On wakeup the windows host does not synchronize the new time with the WSL guests.
The solution is to run `sudo hwclock --hctosys` in the linux guest to re-synchronize its clock to the hardware clock.
Alternatively shutdown and restart the linux guest (e.g. `wsl wsl --shutdown ubuntu`) or reboot the windows host.
This **also affects docker** as it runs as a wsl guest on modern windows installations!

**General:** If the time is out of sync it might be that none of the configured ntp servers are reachable.
Check the manuals for your linux distribution on how to debug/configure ntp or how to manually configure the current time.

### `apt-get update` fails in Ubuntu container due to invalid GPG signature
```bash
$ sudo apt update
…
W: GPG error: http://ports.ubuntu.com/ubuntu-ports focal InRelease: At least one invalid signature was encountered.
…
```
The problem seems to be caused by the fact that the VM hosting the Docker images had run out of disk space ([See StackOverflow](https://stackoverflow.com/a/64553153/13363767)).
The solution is to run `docker image prune -a` or to increase the size of the virtual disk by the virtual machine that is running docker. In Docker Desktop this can be done via Preferences > Resources > Disk image size.

### OpenTOSCA Container stuck at `REQ OUT`

If you're connected to the network via Wifi, try to connect via LAN and replace the IP in .env with you LAN IP.

### not a valid project name

If you see an error like `"OpenTOSCA" is not a valid project name: it must contain only characters from [a-z0-9_-] and start with [a-z0-9]` you need to specify a valid project name for docker compose.
You can do this while starting the docker compose with this command:
```bash
# specify project name with "-p <project name>"
docker compose -p opentosca up
```
or specify the project name in the environment variable `COMPOSE_PROJECT_NAME` e.g. see `_.env` file.

⚠️ make sure your existing `.env` file specifies a valid project name with `COMPOSE_PROJECT_NAME`! (see error message above for the requirements)

---



## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
