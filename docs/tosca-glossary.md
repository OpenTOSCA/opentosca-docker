# Glossary of TOSCA Terms and Concepts

* TOSCA homepage <https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=tosca>
* Current TOSCA 1.3 (YML) standard <https://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.3/os/TOSCA-Simple-Profile-YAML-v1.3-os.pdf>
* Old TOSCA 1.0 (XML) standard <http://docs.oasis-open.org/tosca/TOSCA/v1.0/os/TOSCA-v1.0-os.html>


## TOSCA

A selection of terms used in the TOSCA standard with an informal explanation of the terms.


<figure>

![Some glossary terms and their relations.](./tosca-glossary-overview.svg)

<figcaption>Some of the glossary terms with their relations. Greyed out parts at the top and bottom are there to give more context.</figcaption>
</figure>


 *  **Service**\
    A service is typically used as part of applications.
 *  **Application**\
    A complete application possibly containing multiple services.
 *  **Service Template**\
    Contains exactly one **Topology Template** and metadata describing the service/application modelled in the topology.
    (Section [3.1 of the TOSCA 1.0 standard](http://docs.oasis-open.org/tosca/TOSCA/v1.0/os/TOSCA-v1.0-os.html#_Toc262047504) contains a nice graphic of what a service template contains.)
 *  **Cloud Service Archive** (CSAR) / **Quantum Application Archive**\
    Contains all resources needed to deploy a service/application modelled with TOSCA (e.g. the Service Model, the Deloyment Artifacts, the Implementation Artifacts) in a single archive.
 *  **Management-Plan** / **Deployment-Plan**\
    Executable workflow that orchetrates all required steps to perform a specific management or deployment operation.
    The plans can be used to imperatively model management or deployment.
 *  **Topology**\
    A topology describes the parts of an application/service, their properties and connections.
 *  **Topology Template**\
    Graph describing the topology of a service/application with **Node Templates** connected by **Relationship Templates**.
 *  **Node Type**\
    Defines the semantics of **Node Templates** by specifying **Properties** and **Management Interfaces**.
 *  **Node Type Implementation**\
    Represents a concrete implementation of the **Node Type** semantics.
    The Implementation is provided using **Implementation Artifacts**.
 *  **Node Template**\
    Represents a deployable resource in a topology.
    The Node Template is defined by a **Node Type** and can have **Deployment Artifacts** containing application code that should be deployed.
 *  **Relationship Type**\
    Defines the semantics of **Relationship Templates** by specifying **Properties** and **Management Interfaces**.
    See also [Relationship Type Semantics](#relationship-type-semantics)
 *  **Relationship Type Implementation**\
    Represents a concrete implementation of the **Relationship Type** semantics.
    The Implementation is provided using **Implementation Artifacts**.
 *  **Relationship Tmplate**\
    Represents a connection between the deployable resources (**Node Templates**) in a topology.
    The Relationship Template is defined by a **Relationship Type**.
 *  **Property**\
    A Property is a Variable that can be set by the end-user, a child type, or a template.
    Properties are available for **Implementation Artifacts** as Environment Variables if specified in the **Management Operation** implemented by that Implementation Artifact.
 *  **Management Interface**\
    A group of **Management Operations** with a name.
 *  **Management Operation**\
    An invokable operation of a **Management Interface** that can perform a specific management/deployment task.
    Implemented by an **Implementation Artifact**.
    Defines which of the available properties are passed to the Implementation Artifact.
    For Relationships the Properties can be prefixed with `TARGET_` and `SOURCE_` to select Properties from the target or source node from the Relationship.
 *  **Implementation Artifact** (IA)\
    Implementation of a **Management Operation**.
    Has access to **Properties** through Environment Variables.
 *  **Deployment Artifact** (DA)\
    Application code and or config files needed to run the application.
    Managed and executed by an **Implementation Artifact**.


## OpenTOSCA

A more complete overview over the OpenTOSCA ecosystem can be found here: <https://github.com/OpenTOSCA/opentosca-docker>

 *  **TOSCA Runtime** ([OpenTOSCA Container API](https://github.com/OpenTOSCA/container))\
    The runtime is responsible for executing (read deploying) the TOSCA topologies and Management-/Deployment-Plans.
    The OpenTOSCA declarative runtime can directly execute a TOSCA topology.
    The OpenTOSCA imperative runtime can execute deployment plans (backed by [Plan Engine BPEL (Apache ODE)](https://github.com/OpenTOSCA/ode) or [Plan Engine BPMN (Camunda)](https://github.com/OpenTOSCA/camunda-bpmn))
 *  **OpenTOSCA Modelling** / [**Eclipse Winery**](https://github.com/OpenTOSCA/winery)\
    Topology modelling tool and CSAR repository.
 *  **VinoThek** / [**OpenTOSCA UI**](https://github.com/OpenTOSCA/ui)\
    User Interface for the OpenTOSCA runtime and self-service portal for deploying applications/services available as CSARs in the configured CSAR repository.


## Relationship Type Semantics

| Relationship Type | Explanation | Use-Case |
|:------------------|:------------|:---------|
| **ConnectsTo**    | A relationship describing a connection between two node templates (often on different hosts, e.g. different containers or VMs). Requires source **and** target to be deployed. | Connecting an application with its database. |
| **DependsOn**     | A relationship describing a dependency between nodes on the same host (container or VM). Requires the target node to be deployed first. | A python application depends on a python runtime.
| **HostedOn**      | A similar relationship to DependsOn, but describing a stronge hosted on dependency where the target hosts the source. Requires the target node to be deployed first. | A website hosted on an http server or an application hosted on a virtual machine operating system. |
| **AttachesTo**    | A relationship from the TOSCA standard. Not used in OpenTOSCA | – |
| **RoutesTo**      | A relationship from the TOSCA standard. Not used in OpenTOSCA | – |
