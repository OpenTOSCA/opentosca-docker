# Tutorial: Model and Deploy an Application with OpenTOSCA

This tutorial takes you through the steps to model and deploy a simple application using OpenTOSCA in the development docker-compose setup.
The application modeled in this tutorial is the Shor example that can also be found in the [PlanQK](https://platform.planqk.de/#homepage) marketplace.

:information_source: Terms in *italics* can be found in the [glossary](tosca-glossary.md).

**Requirements:**

 *  [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (optionally GIT-LFS)
 *  [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
 *  At least 6GB RAM free for the OpenTOSCA docker-compose

Before starting with this tutorial clone the <https://github.com/OpenTOSCA/opentosca-docker> repository and read through the relevant sections of the README once (e.g. the first two sections, tips and tricks and troubleshooting).

## Model the Application

### 1. Starting OpenTOSCA

Before starting the OpenTOSCA docker compose file change the `WINERY_REPOSITORY_URL` to `https://github.com/UST-QuAntiL/tosca-definitions-qc-applications`.

Then start OpenTOSCA according to the instructions in the <https://github.com/OpenTOSCA/opentosca-docker> repository.

:bangbang: Remember the `PUBLIC_HOSTNAME` from this step! In most cases, the public hostname will be the IP address of your computer, e.g., something like `111.112.113.114`.


### 2. Creating the Service Template

Open the *Winery* in your browser (`http://${PUBLIC_HOSTNAME}:8080` [replace `${PUBLIC_HOSTNAME}`] or <http://localhost:8080>).

Applications are modeled with *Service Templates*.
Create a new Service Template using the "Add new" button on the right.
Fill in the following values:

| Name | Value | Explanation |
|:-----|:------|:------------|
| Name | shor-example | Service Template Name. No spaces allowed. |
| Versioning | latest | Enables versioning and creates a "latest" version. (This is optional) |
| Namespace | `https://ust-quantil.github.io/quantum/applications/servicetemplates` | Namespace where the Service Template should be put into. Can be found in the "Administration" tab of the Winery or in the [admin/namespaces/Namespaces.json](../admin/namespaces/Namespaces.json) file of this repository. |

![create new service template dialog filled out](./images/add-versioned-service-template-dialog.png)

Now it is possible to create a "README", "LICENCE" and "Documentation" as needed.
If you choose a predefined license make sure to fill in the correct copyright information.
This step may be omitted when following this tutorial for testing purposes, but is required for apps that should be publicly available.

Fill in information about the application in the Service Template in the "Self-Service Portal" tab.
Set a name, a description and optionally an icon and preview image.
The self-service portal information is used later in the OpenTOSCA UI.
Make sure to save your changes.

![Shor service template with the self-service portal tab open](./images/self-service-tab.png)

:bangbang: Make sure to save the self-service portal information or your changes will be lost.


### 3. Define the Topology

Open the "Topology Template" tab of the shor-example *Service Template* and open the topology modeler by clicking the "Open Editor" button.
The modeler will open in a new tab.

:warning: The modeler does not auto-save. Make sure to **manually save** all changes **before leaving** the modeler!

The nodes on the left are grouped by the namespaces they are in.
Drag the following nodes from the pallete on the left into the canvas to model the Shor UI:

| Node | Namespace | Explanation |
|:-----|:----------|:------------|
| DockerEngine_w1 | `http://opentosca.org/nodetypes` | The docker engine responsible for building and running the container.|
| DockerContainer_w1 | `http://opentosca.org/nodetypes` | The docker container hosting the Shor UI code. |
| NGINX_latest-w1 | `http://opentosca.org/nodetypes` | The webserver delivering the Shor UI code. |
| Shor-UI_w1 | `https://ust-quantil.github.io/quantum/applications/nodetypes` | The Shor UI code. The node type is derived from `{http://opentosca.org/nodetypes}NGINX-Application_w1` |

![topology with node templates and an open node template palette on the left](./images/topology-nodes-only-with-open-palette.png)

Click on a *Node Template* to edit its *Properties* and to create new *Relationship Templates* by dragging one of the handles in the expanded Node Template to another node template.

![topology with a node template selected and open properties sidebar on the right](./images/topology-node-selected.png)

Next we will connect the nodes with *Relationship Templates* to define the dependencies and deployment order of the nodes.

Connect all node templates in the topology with "HostedOn" relationship templates.
Start with the Shor-UI_w1 node template that is "HostedOn" the NGINX_latest-w1 node template that is "HostedOn" the DockerContainer_w1 node template that is "HostedOn" the DockerEngine_w1 node template.
The different *relationship types* are explained in the glossary.

![topology with connected node templates](./images/topology-nodes-with-relationships.png)


We also need to model the actual Shor service.
For this we need the following additional nodes:

| Node | Namespace | Explanation |
|:-----|:----------|:------------|
| DockerContainer_w1 | `http://opentosca.org/nodetypes` | The docker container hosting the Shor code. |
| Python_3-w1 | `http://opentosca.org/nodetypes` | The python interpreter running the Shor algorithm. |
| Qiskit_latest-w1 | `https://ust-quantil.github.io/nodetypes` | The SDK required to run the Shor algorithm. |
| Qiskit-App_w1 | `https://ust-quantil.github.io/nodetypes` | The Shor algorithm. |
| IBMQ_w1 | `https://ust-quantil.github.io/nodetypes` | The proxy node for the connection to the IBMQ cloud. |

![complete topology with all node templates](./images/topology-nodes-complete.png)

Now connect all the nodes accordingly:

| Node | Connection Type | Target Node | Comment |
|:-----|:---------------:|:------------|:--------|
| Python_3-w1 | HostedOn | DockerContainer_w1 |  |
| Qiskit_latest-w1 | HostedOn | DockerContainer_w1 |  |
| Qiskit_latest-w1 | DependsOn | Python_3-w1 | Qiskit must be installed after python |
| Qiskit_latest-w1 | HostedOn | IBMQ_w1 | Quiskit circuits are executed on the IBMQ infrastructure. See also [TOSCA4QC: Two Modeling Styles for TOSCA to Automate the Deployment and Orchestration of Quantum Applications](https://doi.org/10.1109/EDOC49727.2020.00024) for more information. |
| Qiskit-App_w1 | HostedOn | Qiskit_latest-w1 | Qiskit_latest-w1 already depends on python and IBMQ so there is no need for additional connections on this node. |
| Shor-UI_w1 | ConnectsTo | Qiskit-App_w1 | Models the connection between the Shor UI and the backend service. |

![full topology with all node templates connected](./images/topology-nodes-complete-with-relationships.png)

:information_source: Save the changes made so far in the topology modeler.

### 4. Set the Node Template Properties

Use the menu above to show the properties in the node templates (click on "Properties" next to "Types").
Open the properties of the DockerContainer_w1 node template and fill in "ubuntu:20.04" in the "ImageID" property.
Alternatively click on the node and edit the property in the sidebar on the right.
Now fill in the other properties:

| node template | property | value | explanation |
|:--------------|:---------|:------|:------------|
| DockerEngine_w1 | DockerEngineURL | `get_input: DockerEngineURL` | The URL to the docker engine that is used to create the containers. This tutorial uses the Docker-in-Docker (dind) container that is part of the OpenTOSCA docker-compose file. Provided at deployment time by the end user (see explanation below). |
| DockerContainer_w1 (ui) | ImageID | `ubuntu:20.04` | The base image to use. |
| DockerContainer_w1 (ui) | ContainerPort | `80` | NGINX runs on port 80 so that port must be mapped outside. |
| DockerContainer_w1 (ui) | Port | `get_input: FrontendPort` | The port exposed outside. Provided at deployment time. |
| Shor-UI_w1 | AppName | `ShorAppUI` | The app name is used as a folder name where the DA contents are extracted to. The app will be treated as the http root of NGINX. |
| DockerContainer_w1 (backend) | ImageID | `ubuntu:20.04` | The base image to use. |
| DockerContainer_w1 (backend) | ContainerPort | `get_input: BackendPort` | The internal backend port (same as the exposed port). Provided at deployment. |
| DockerContainer_w1 (backend) | Port | `get_input: BackendPort` | The port exposed outside. Provided at deployment time. |
| Qiskit-App_w1 | Port | `get_input: BackendPort` | The port the qiskit app should bind to. Provided at deployment time. |
| IBMQ_w1 | PROVIDER | `IBMQ` | The cloud provider to use. |
| IBMQ_w1 | IBMQ_BACKNED_NAME | `get_input: IBMQ_BACKNED_NAME` | The name of the quantum computing resource that should be used. Provided at deployment time. |
| IBMQ_w1 | IBMQ_TOKEN | `get_input: IBMQ_TOKEN` | The API token to use for authentication. Provided at deployment time. |

:information_source: The value `get_input: <variable name here>` is a special value that is replaced by a user input before deploying the service template.
The name of the user input comes after the colon `get_input: <variable name here>` (replace `<variable name here>` including the angled braces).
All properties with the same variable name in the same service template will **share** the value of the user input.
During deployment the user is asked to provide values for every variable defined in this way.

![topology with properties shown in node templates](./images/topology-with-properties.png)

:information_source: Save the changes made so far in the topology modeler.


### 5. Add the Deployment Artifacts

*Deployment Artifacts* are used to provide the actual application code used by the node template.

Next use the menu at the top to toggle the "DeploymentArtifacts" on (and hide the "Properties" again for better overview).
Open the "Deployment Artifacts" of the Qiskit-App_w1 node template and click on "Add new Deployment Artifact".

![node template with open deployment artifact section](./images/topology-add-deployment-artifact.png)


| Input | Value |
|:------|:------|
| Name  | ShorQiskit_DA |
| Create Artifact Template | :radio_button: |
| Namespace | `https://ust-quantil.github.io/quantum/applications/artifacttemplates` |
| Artifact Template Name | ShorQiskit_DA_template |
| Artifact Type | QiskitApp |

![filled out deployment artifact creation dialog](./images/add-deployment-artifact-dialog.png)

:bangbang: Save the topology now!

To upload the actual *deployment artifact* go back to the Winery after **saving** the topology.
Close the tab of the topology modeler to go back to the original winery tab.

The created artifact template can be found under the "Other Elements" tab at the top.

![winery with other elements tab open](./images/other-elements-tab.png)

Click on the "Artifact Templates" button and search for the created artifact template name.
It is also possible to navigate directly from the topology modeler to the *deployment artifact* by clicking on the `DA-Ref` in the node.

Open the files tab of the *deployment artifact* and upload the provided artifact template ([download link](https://raw.githubusercontent.com/UST-QuAntiL/tosca-definitions-qc-applications/main/artifacttemplates/https%253A%252F%252Fust-quantil.github.io%252Fquantum%252Fapplications%252Fartifacttemplates/ShorAlgo_Qiskit-w1/files/qiskit_app_algo.py)).
Use the "Select files" button on the left (labelled as "Dateien Auswählen") or the file drop area to upload the python file.

![Shor deployment artifact file upload](./images/da-template-files-tab.png)

Now the service template is ready to be deployed.


## Deploy the Application

This part assumes that you have followed the first part from start to finish and have a running OpenTOSCA docker compose.


### 6. Load the CSAR from the Winery

Open the OpenTOSCA UI in your browser (`http://${PUBLIC_HOSTNAME}:8088` [replace `${PUBLIC_HOSTNAME}`]).
You can look it up again in the `.env` file you have created in the opentosca-docker repository.

:warning: Do **not** use `localhost` to access the OpenTOSCA UI. The UI uses its URL to derive the URLs of the Winery and the Container. If you still experience problems with the following steps first read the [troubleshooting section](https://github.com/OpenTOSCA/opentosca-docker#troubleshooting) of the opentosca-docker repository.

Go to the "Repository" tab to see the list of applications that can be imported from the Winery.

![repository tab tab of the OpenTOSCA UI](./images/tosca-ui-repository-tab.png)

Import the Example Shor Application (with the id `shor-example_latest-w1-wip1`) by clicking the :heavy_plus_sign: button of the card.
Do **not** check "Apply Management Feature Enrichment".
Wait for it to process (the button changes to a green checkmark) before going to the next step.

Switch back to the "Applications" tab to verify that the application was imported correctly.

![applications tab tab of the OpenTOSCA UI](./images/tosca-ui-applications-tab.png)

### 7. Create a new Instance

First click on the "Show details…" button of the Example Shor Application card (left of the trashcan button).

![first step of the create new instance dialog](./images/tosca-ui-shor-frontend.png)

Create a new instance by clicking the :heavy_plus_sign: "Provision new instance…" button.

![second step of the create new instance dialog with filled in properties](./images/tosca-ui-new-instance-dialog-selection.png)

Select "initiate" in the dropdown and click on "next".
Provide values for the properties defined with `get_input: …` (see [4. Set the Node Template Properties](#4-set-the-node-template-properties)).

| Property | Value | Explanation |
|:---------|:------|:------------|
| DockerEngineURL | `tcp://${PUBLIC_HOSTNAME}:2222` | The address of the (host of the) dind container. [replace `${PUBLIC_HOSTNAME}`] |
| FrontendPort    | `9992` | A port between `9990` and `9999` as only these ports are exposed by default in the dind container. (May be changed in the docker-compose file.) |
| BackendPort     | `9991` | A port between `9990` and `9999`. |
| IBMQ_BACKNED_NAME     | `ibmq_qasm_simulator` | The online state vector simulator for quantum circuits. |
| IBMQ_TOKEN     | `xxxxxxxx` | Your API token. |

![image dialog filled out](./images/tosca-ui-new-instance-dialog-properties.png)

Click run to start the deployment.
To monitor the deployment click on the :arrows_counterclockwise: "Reload Instances" button to update the instance list below.
Each instance also has a "show details" button.
The instance details page allows viewing the logs and outputs of running and completed management plans.

![details page of the instance being created](./images/tosca-ui-shor-instance.png)

To watch the deployment in the console see the [Useful Commands](https://github.com/OpenTOSCA/opentosca-docker#useful-commands) section of the OpenTOSCA docker-compose repository.
Attach to the logs of `container`, `engine-ia` and `engine-plan` in two separate terminals with the provided commands for the best overview.

To verify that your deployment was actually successful open <http://localhost:9992/> (change the port if you have chosen another port for the frontend before) in your browser.

### Tutorials for relations (available soon)

#### Tips for connectTo

+ If a component is already running, restart component during the connectTo execution.
+ Save the process ID in a `${AppName}.pid` file. This ID can be used by the connectTo to end the process and start it again.
  + How to get a process ID: <https://stackoverflow.com/a/17389526/6592788>.
