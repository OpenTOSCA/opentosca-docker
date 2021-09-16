# Advanced How-To Manuals

Simple How-To section to cover different kinds of use cases.

> **Info:** We use the override feature of Docker Compose to provide different configurations for certain use cases.
> [More information](https://docs.docker.com/compose/extends).
>
> Basic override file with common configuration settings for our environment: [`_docker-compose.override.yml`](_docker-compose.override.yml).
> Simply, make a copy and modify it to your needs:
> ```shell
> cp _docker-compose.override.yml docker-compose.override.yml
> ```
>
> Settings from `docker-compose.override.yml` are applied automatically when using `docker-compose up`.


## How to configure the OpenTOSCA UI to use a different Winery repository

* Open the "Administration" tab in the OpenTOSCA UI
* In the "Repository Configuration" section click on the "OpenTOSCA" entry (it should have the URL `http://localhost:8080/winery/servicetemplates/` if the configuration was not changed before)
* Change the domain (and port) in the dialog to point to the Winery server you want to use (e.g. `http://winery.example.com:8181/winery/servicetemplates/`)
* Wait until the new URL is checked by the OpenTOSCA UI
* Click "Save"

The configuration is stored locally in the [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) (under the key `opentosca`) of your browser and should survive reloads of the page.

To clear the configuration data, first try to change the settings in the "Administration" tab.
If that does not work, use tho development tools of the browser and clear the local storage manually (in chrome it can be found in the "Application" tab of the development tools).


## How to use an existing **local** Winery repository

You can map an existing Winery repository (on your host) as a volume into the `winery` container.

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Use the following configuration in order to map a repository:

  ```yaml
    winery:
      volumes:
        - <path on host system>:/var/opentosca/repository
      environment:
        WINERY_REPOSITORY_PATH: /var/opentosca/repository
  ```

* Replace `<path on host system>` with the path to a valid Winery repository (can be empty)
* Start the environment as usual: `docker-compose up -d`


## How to use an existing **public git** Winery repository

You can instruct Winery to use a public git repository which it clones on startup.

* In the `docker-compose.override.yml` file add the following map:

```yml
    winery:
      environment:
        WINERY_REPOSITORY_URL: <git url>
        # exmaple: WINERY_REPOSITORY_URL: https://github.com/OpenTOSCA/tosca-definitions-public
```


## How to run the environment with WSO2 BPS engine

Start the environment with the `docker-compose.bps.yml` override:

```shell
docker-compose -f docker-compose.yml -f docker-compose.bps.yml up -d
```


## How to debug components running inside the environment

* Create a `docker-compose.override.yml` file (or copy it from `_docker-compose.override.yml`)
* Make sure you enable and set the certain Java debug options (e.g., `-Xdebug`)
* Start the environment as usual: `docker-compose up -d`


## How to clone a **private** TOSCA definitions repository to be used with Winery

* Start the environment as usual: `docker-compose up -d`

* Log in to the Winery container and clone the respective Git repository manually (we use our internal `tosca-definitions-internal` repo as an example here):

  ```shell
  docker-compose exec winery bash
  rm -rf ${WINERY_REPOSITORY_PATH}
  git clone https://github.com/OpenTOSCA/tosca-definitions-internal ${WINERY_REPOSITORY_PATH}
  exit
  ```

* Open Winery at <http://localhost:8080>
  > **Note:** Changes to the repository has to be pushed manually with `git push`.


## How to extend Winery's JVM Heap Size

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

