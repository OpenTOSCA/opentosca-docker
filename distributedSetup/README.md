## How to run cooperating Containers in a distributed setup

You can run multiple cooperating OpenTOSCA Containers in a distributed setup to circumvent firewall issues when accessing protected devices.

To use this feature, one Container needs to be executed in each protected network and one Container must be globally accessible.
This How-To section shows how to setup a distributed OpenTOSCA Container in a Master/Slave architecture to enable the management of devices in two protected networks.

* Master setup:
  * Copy the `docker-compose.master.yml` file to a machine with open port `1883`
  * Replace `${PUBLIC_HOSTNAME_MASTER}` with the public IP of the machine or set an environment variable
  * Run `docker-compose -f docker-compose.master.yml up -d`
  * Wait until the MQTT broker is started before continuing to setup the slaves
* Slave 1 setup (configure slave 2 equally):
  * Copy the `docker-compose.slave1.yml` file to a machine in a protected network
  * Replace `${PUBLIC_HOSTNAME_SLAVE_1}` with the IP of the machine and ${PUBLIC_HOSTNAME_MASTER} with the IP of the master machine
  * If you use another port for MQTT at the master change `COLLABORATION_PORTS` accordingly
  * Run `docker-compose -f docker-compose.slave1.yml up -d`
* Afterwards devices can be registered at the slaves and are then accessible by deployment operations triggered by te master
  * [More information](https://elib.uni-stuttgart.de/bitstream/11682/10328/1/Ausarbeitung.pdf) about how to register devices

### Peer-to-Peer and other setups

It is also possible to create a Peer-to-Peer architecture with multiple OpenTOSCA Containers or to register a slave with multiple master nodes.

* The environment variables `COLLABORATION_HOSTNAMES` and `COLLABORATION_PORTS` accept a comma seperated list of values
* Each value represents another Container from which requests should be accepted
* Therefore, any topology can be created, e.g., for Peer-to-Peer all Containers get the Hostnames of all other Containers
* However, ensure that the MQTT ports of all registered Containers are accessible

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.
