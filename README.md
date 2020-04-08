# P2P Energy Flexibility Marketplace Federation Adapter

## Description
The files contained in this repository, enable the deploy of the software components upon which the SOFIE Federation Adapter (FA) used by the P2P Energy Flexibility Marketplace pilot is based.

The FA itself is based on the [FIWARE](https://www.fiware.org/) platform. The `docker-compose.yml` file provided is already configured to set up the execution environment composed by FIWARE Orion Context Broker, FIWARE IoT-Agent, FIWARE STH Comet, MongoDB, and Mosquitto MQTT using containers.

`index.js` executes a CLI application designed to demonstrate how the system works. Alternatively, once the required containers have been set up, it is possible to manually interact with the software components through their APIs (e.g. following the basic FIWARE [tutorial](https://fiware-tutorials.readthedocs.io/en/latest/index.html)).

### Key Technologies

- Docker with docker-compose
- Node.js with npm

## Execution
To start the software components using `docker-compose` run:
```bash
docker-compose up -d
```
install the dependencies required by the CLI utility:
```bash
npm install
```
then run launch the CLI utility with:
```bash
npm start
```
finally, run
```bash
docker-compose down
```
to stop and clean the running containers.

### CLI Utility
The utility guides you through 5 steps:

- Check the IoT Agent Service Health
- Provision a Service Group
- Provision a Sensor
- Simulate IoT Device Measure via MQTT
- Retrieve the Entity Data

Step `1` just checks that the IoT Agent is up and running.
Steps `2` and `3` are configuration steps and need to be executed once.
Step `4` simulates receiving IoT measures from the sensor just configured via MQTT.
Finally, step `5` shows the latest available context data.

You can cycle through steps `4` and `5`, providing new measures and watching how the context information changes.


### Deployment
The following services are available when the component is running: 
- http://localhost:27017/ mongo-db
- http://localhost:1883/ mosquitto
- http://localhost:9001/ mosquitto
- http://localhost:8666/ fiware-sth-comet
- http://localhost:1026/ fiware-orion
- http://localhost:4041/ fiware-iot-agent
- http://localhost:7896/ fiware-iot-agent

## Contact info
Giuseppe Raveduto: <giuseppe.raveduto@eng.it>
