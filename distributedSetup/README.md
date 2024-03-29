## How to run cooperating Containers in a distributed setup

You can run multiple cooperating OpenTOSCA Containers in a distributed setup to circumvent firewall issues when accessing protected devices.

To use this feature, one Container needs to be executed in each protected network and one Container must be globally accessible.
This How-To section shows how to set up a distributed OpenTOSCA architecture to enable the management of devices in two protected networks.

* Coordinator setup:
  * Copy the repository to a machine with open port `1883`
  * Replace `${PUBLIC_HOSTNAME_COORDINATOR}` in the `distributedSetup/docker-compose.coordinator.yml` file with the public IP of the machine or set an environment variable
  * Run `docker-compose -f distributedSetup/docker-compose.coordinator.yml up -d` from the root directory of the repository
  * Wait until the MQTT broker is started before continuing to set up the emissaries
* Emissary setup (configure both emissaries equally):
  * Clone the repository to a machine in a protected network
  * Replace `${PUBLIC_HOSTNAME_EMISSARY_1}` in the `distributedSetup/docker-compose.emissary.yml` file with the IP of the machine and `${PUBLIC_HOSTNAME_COORDINATOR}` with the IP of the coordinator's machine
  * If you use another port for MQTT at the coordinator, change `COLLABORATION_PORTS` accordingly
  * Run `docker-compose -f distributedSetup/docker-compose.emissary.yml up -d` from the root directory of the repository
* Afterwards devices can be registered at the emissaries and are then accessible by deployment operations triggered by the coordinator
  * [More information](https://elib.uni-stuttgart.de/bitstream/11682/10328/1/Ausarbeitung.pdf) about how to register devices

### Peer-to-Peer and other setups

It is also possible to create a Peer-to-Peer architecture with multiple OpenTOSCA Containers or to register a emissary with multiple coordinator nodes.

* The environment variables `COLLABORATION_HOSTNAMES` and `COLLABORATION_PORTS` accept a comma separated list of values
* Each value represents another Container from which requests should be accepted
* Therefore, any topology can be created, e.g., for Peer-to-Peer all Containers get the Hostnames of all other Containers
* However, ensure that the MQTT ports of all registered Containers are accessible

### Setup on IoT devices

In some scenarios only small devices (e.g. Raspberry Pis) are available in a network.
Therefore, they must be used to set up a local OpenTOSCA Container with its environment (engine-ia-jdk8, engine-ia-jdk17, engine-plan-bpel, ...).
However, this can slow down the devices enormously.

The following Docker Containers can be excluded from the docker-compose file of OpenTOSCA Containers which are only intended to receive request from other Containers:
* proxy
* dind
* winery
* container-repository

The UI, engine-plan-bpel, and engine-plan-bmpn could be excluded for the execution of requests too. 
However, they are currently needed to register devices, which should be replaced by a device discovery component later on.

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
