# Container Overview

![OpenTOSCA Docker-Compose overview diagram.](docker-compose-overview.svg)


## container 

Image: [`opentosca/container:latest`](https://hub.docker.com/r/opentosca/container) [GitHub](https://github.com/OpenTOSCA/container)

Main coordinator of the whole OpenTOSCA machinery.
Provides the application bus (for inter application communication) and the management bus (for management/deployment commands).
Hosts a plan generator to generate BPEL deployment plans from topologies in a CSAR.
Invokes management and deplyoment plans, relays implementation artifact (IA) commands to [engine-ia](#engine-ia).
Manages metadata, logging, etc. of deployed instances.

Ports:

 *  1337: Main API
 *  1883: MQTT (used for distributed/federated deployment of multiple container instances)
 *  8081-8087: Application Bus and Management Bus

### Dependencies

 *  [engine-ia](#engine-ia) via docker-compose network\
    Used to deploy and execute implementation artifacts when requested via the management bus.
 *  [engine-plan](#engine-plan) via docker-compose network\
    OR [engine-plan-bpmn](#engine-plan) via docker-compose network\
    Used to run deployment and management plans. Only one engine is technically neccessary, but it must be able to execute all plans (workflows) in the CSAR archives in question.
 *  [container-repository](#container-repository) via docker host\
    Used to fill in missing information in CSARs (research feature).
 *  [dind](#dind) not configured in compose file...\
    Used as docker endpoint to create docker containers.


## container-repository

Image: [`opentosca/winery:latest`](https://hub.docker.com/r/opentosca/winery) [GitHub](https://github.com/OpenTOSCA/winery)

Implementations of reasearch features.
Used to fill in missing information of CSARs.

Ports:

 *  8091 (internal 8080): Main API

### Dependencies

 *  [container](#container) via docker host
 *  [winery](#winery) via docker host\
    Used as CSAR repository.
 *  [workflow-modeler](#workflow-modeler) via docker host
 *  [topology-modeler](#topology-modeler) via docker host


## ui

Image: [`opentosca/ui:latest`](https://hub.docker.com/r/opentosca/ui) [GitHub](https://github.com/OpenTOSCA/ui)

OpenTOSCA user interface for the container.
Manages the deployment and management processes.
Uses the winery to fetch CSARs to be imported into the container.
The winery instance that is used as the CSAR repository can be changed in the administration settings of the UI at runtime.

Ports:

 *  8088 (internal 8080): User Interface

### Dependencies

 *  [container](#container) via docker host??
 *  [winery](#winery) via docker host??\
    Used as CSAR repository.


## engine-plan

Image: [`opentosca/ode:latest`](https://hub.docker.com/r/opentosca/ode) [GitHub](https://github.com/OpenTOSCA/ode)

BPEL workflow execution engine used to execute the deployment or management workflows of a CSAR.
Default workflow engine (generator in container outputs BPEL workflows).

Ports:

 *  9763: Main API


## engine-plan-bpmn

Image: [`opentosca/camunda-bpmn:latest`](https://hub.docker.com/r/opentosca/camunda-bpmn) [GitHub](https://github.com/OpenTOSCA/camunda-bpmn)

Workflow engine to execute BPMN2 workflows.
Optional if all workflows use BPEL.

Ports:

 *  8092 (internal 8080): Main API


## engine-ia

Image: [`opentosca/engine-ia:latest`](https://hub.docker.com/r/opentosca/engine-ia) [GitHub](https://github.com/OpenTOSCA/engine-ia)

Application server (Apache Tomcat) for hosting and executing implementation artifacts (IA).
IAs can be executed in the generic environment of the `engine-ia` (e.g. IAs that deploy new VMs) or can trigger execution of IAs on deployed containers/VMs.

Ports:

 *  8090 (internal 8080): Main API

## winery

Image: [`opentosca/winery:latest`](https://hub.docker.com/r/opentosca/winery) [GitHub](https://github.com/OpenTOSCA/winery)

Modelling UI for TOSCA topologies and repository for CSARs.

Ports:

 *  8080: User Interface (and API?)

### Dependencies

 *  [container](#container) via docker host\
    Used to generate plans from the current topology.
 *  `workflow-modeler` via docker host\
    Optional external component
 *  `topology-modeler` via docker host\
    Optional external component

## dind

Image: `jpetazzo/dind:latest`

Packaged docker in docker to allow OpenTOSCA to create new docker containers.
The ports available for these containers can be adjusted in the docker-compose overlay.
The provided default overlays expose the port range 9990-9999.

Ports:

 *  2222 (internal 2375): docker demon API
 *  9990-9999 (via overlay): for created docker containers

## proxy

Image: built from local dockerfile

Proxies calls into the docker-compose network.
Optional component.

Ports:

 *  80: Proxy port
