# Deploy in Production (Linux only!)

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

:warning: The production config `docker-compose.prod.yml` maps the local docker socket into the [dind](./container-overview.md#dind) container.
This exposes the **local** docker deamon to the OpenTOSCA containers!
