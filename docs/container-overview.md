# Container Overview

![OpenTOSCA Docker-Compose overview diagram.](docker-compose-overview.svg)


## About the Network

The containers in the docker-compose file use a bridge network (named `opentosca`).
Dependencies that are accessed over that bridge network are marked with *"via docker-compose network"*.

Because the docker compose file is also used during development on one or more components most dependencies are actually accessed through the public IP of the host computer by default (marked with *"via docker host"*).
This allows starting some containers from the docker compose and some in a local dev setup.
However it can also lead to problems if the public IP has changed or a firewall blocks access to the public IP from the containers.

If everything is started via docker-compose on Windows or Mac then it may be possible to use `host.docker.internal` as the public IP/domain.
(see also <https://docs.docker.com/desktop/windows/networking/#use-cases-and-workarounds> or <https://docs.docker.com/desktop/mac/networking/#use-cases-and-workarounds>)

On windows `host.docker.internal` is also known for the windows host.
For mac this is not the case.
A workaround for mac is to add the following entry to the `/etc/hosts` file (needs administrator rights!):

```
# manually added
127.0.0.1   host.docker.internal
```


## container 

Image: [`opentosca/container:latest`](https://hub.docker.com/r/opentosca/container) ([stable images](https://hub.docker.com/r/opentosca/container/tags?page=1&ordering=last_updated) also available) [GitHub](https://github.com/OpenTOSCA/container)

Main orchestrator of the whole OpenTOSCA ecosystem.
Provides the application bus (for inter application communication) and the management bus (for management/deployment commands).
Hosts a plan generator to generate generate various BPEL plans (deployment, termination, scale-up,..) of topologies given via a CSAR.
Invokes management and deplyoment plans, relays messages to implementation artifacts (IAs) hosted on the [engine-ia](#engine-ia) or on components of a topology.
Manages metadata, logging, etc. of deployed instances.

Ports:

 *  1337: Main API
 *  1883: MQTT (used for distributed/federated deployment of multiple container instances)
 *  8081-8087: Application Bus and Management Bus

### Dependencies

 *  [engine-ia](#engine-ia) via docker-compose network\
    Used to deploy and execute implementation artifacts implemented as WebServices and used via the management bus.
 *  [engine-plan](#engine-plan) via docker-compose network\
    OR [engine-plan-bpmn](#engine-plan-bpmn) via docker-compose network\
    :warning: `engine-plan` is currently unmaintained but still neccessary for generated BPEL plans.\
    Used to run deployment and management plans. Only one engine is technically neccessary, but it must be able to execute all plans (workflows) in the CSAR archives in question.
 *  Optional: [container-repository](#container-repository) via docker host\
    Used to enable topology completion, instance freeze and defrost features.

### Dependencies for Deploying APPs

 *  Optional [dind](#dind) configured by end user as deployment endpoint\
    Used as docker engine (in docker) to create docker containers for testing, demonstration and learning purposes.
 *  Optional [openstack](https://www.openstack.org) compatible endpoint, configured by end user as deployment endpoint\
    Used to provision reqiored VM resources and machines.


## container-repository

Image: [`opentosca/winery:latest`](https://hub.docker.com/r/opentosca/winery) [GitHub](https://github.com/OpenTOSCA/winery)

Implementations of reasearch features.
Used to fill in missing information of CSARs.

Ports:

 *  8091 (internal 8080): Main API

### Dependencies

 *  [container](#container) via docker host


## ui

Image: [`opentosca/ui:latest`](https://hub.docker.com/r/opentosca/ui) [GitHub](https://github.com/OpenTOSCA/ui)

OpenTOSCA user interface for the container.
Manages the deployment and management processes.
Uses the winery to fetch CSARs to be imported into the container.
The winery instance that is used as the CSAR repository can be changed in the administration settings of the UI at runtime.

Ports:

 *  8088 (internal 8080): User Interface

### Dependencies

 *  [container](#container) via docker host (configured from browser URL)
 *  [winery](#winery) via docker host (configured from browser URL)\
    Used as CSAR repository.


## engine-plan

Image: [`opentosca/ode:latest`](https://hub.docker.com/r/opentosca/ode) [GitHub](https://github.com/OpenTOSCA/ode)

BPEL workflow execution engine (a dockerized version of [Apache ODE](http://ode.apache.org/)) used to execute the deployment or management workflows of a CSAR.
Default workflow engine (generator in container outputs BPEL workflows).

:warning: The BPEL Engine is deprecated.
All plans should use BPMN if possible.

Ports:

 *  9763: Main API


## engine-plan-bpmn

Image: [`opentosca/camunda-bpmn:latest`](https://hub.docker.com/r/opentosca/camunda-bpmn) [GitHub](https://github.com/OpenTOSCA/camunda-bpmn)

Workflow engine based on the [Camunda BPMN Engine](https://camunda.com/bpmn/) to execute BPMN2 workflows.
Optional if all workflows use BPEL.

Ports:

 *  8092 (internal 8080): Main API


## engine-ia

Image: [`opentosca/engine-ia:latest`](https://hub.docker.com/r/opentosca/engine-ia) [GitHub](https://github.com/OpenTOSCA/engine-ia)

Application server ([Apache Tomcat](http://tomcat.apache.org/)) for hosting and executing implementation artifacts (IA).
IAs can be executed in the generic environment of the `engine-ia` (e.g. IAs that deploy new VMs) or can trigger execution of IAs on deployed containers/VMs.

Ports:

 *  8090 (internal 8080): Main API

## winery

Image: [`opentosca/winery:latest`](https://hub.docker.com/r/opentosca/winery) [GitHub](https://github.com/OpenTOSCA/winery)

Modelling UI for TOSCA topologies and repository for CSARs.

Ports:

 *  8080: User Interface and API

### Dependencies

 *  [container](#container) via docker host\
    Used to generate plans from the current topology.
 *  `workflow-modeler` via docker host\
    Part of the Winery container
 *  `topology-modeler` via docker host\
    Part of the Winery container

## dind

Image: [`jpetazzo/dind:latest`](https://github.com/jpetazzo/dind)

Packaged docker in docker to allow OpenTOSCA to create new docker containers.
The ports available for these containers can be adjusted in the docker-compose overlay.
The provided default overlays expose the port range 9990-9999.

Ports:

 *  2222 (internal 2375): docker demon API
 *  9990-9999: for created docker containers, can be extended in override

## proxy

Image: built from local dockerfile

Proxies calls into the docker-compose network.
Optional component.

Ports:

 *  80: Proxy port
