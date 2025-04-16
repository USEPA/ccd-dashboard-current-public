# CCTE Chemicals Dashboard

## Build Setup

# install dependencies

$ yarn install

# serve with hot reload at localhost:3003

$ yarn dev

## Running UI dev mode in Docker
```bash
# create a .env file in the docker/dev directory, use your network name in place of cvalone
    DOCKER_DEV_USERNAME=cvalone
    DOCKER_DEV_PORT=5303
    COMPOSE_PROJECT_NAME=dashboard-ui-cvalone-docker-dev


# build for local development 
cd docker/dev
$ docker-compose up --build

# Check docker output for ip and port to reach the application
Edit the cypress.json file with the ip and port the container is using like this "baseUrl": "http://172.20.0.2:8001/dashboard"

# Run cypress tests 
$ docker exec -it <container-name> /bin/bash
$ yarn smoke

# build for production and launch server

$ yarn build
$ yarn start

# generate static project
$ yarn generate

## Tests

* "e2e": Runs a headless Cypress end to end test using the default configuration below.
* --config viewportWidth=1280,viewportHeight=720,specPattern=test/e2e/specs
* "e2e-small": Runs a headless Cypress end to end test using the small viewport configuration below.
* --config viewportWidth=520,viewportHeight=720,specPattern=test/e2e/sm_specs
* "e2e:open": Same as e2e only runs in an open viewport
* "e2e:open-small": Same as e2e:small only runs in an open viewport

For detailed Architecture Decision records pertaining to this application, checkout [Architecture Knowledge Management / UI-Components](https://ncct-bitbucket.epa.gov/projects/AKM/repos/ui-components/browse).

# trigger tests in a separate repository ccd-cypress using slash command and pass the results back in ccd-dashboard-ui.
```
# Disclaimer:
The United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use.
EPA has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information.
Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply
their endorsement, recommendation or favoring by EPA. The EPA seal and logo shall not be used in any manner to imply endorsement of any commercial product or
activity by EPA or the United States Government. 
