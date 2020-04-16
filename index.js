#!/usr/bin/env node

const axios = require('axios');
const client = require('mqtt').connect('mqtt://localhost:1883');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readLineAsync(message) {
  return new Promise((resolve) => {
    rl.question(message, answer => resolve(answer));
  });
} 


async function init() {
  console.log('1. Check the IoT Agent Service Health');
  console.log('2. Provision a Service Group');
  console.log('3. Provision a Sensor');
  console.log('4. Simulate IoT Device Measure via MQTT');
  console.log('5. Retrieve the Entity Data');
  console.log('q. to QUIT');

  const choice = await readLineAsync("> ");
  selectionManager(choice);
}

async function selectionManager(selection) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'fiware-service': 'openiot',
      'fiware-servicepath': '/'
    }
  };

  function messageHandler(message, error) {
    if (error) {
      console.error(error);
      init();
    } else {
      console.log(message);
      init();
    }
  }

  switch(selection) {
    case '1':
      axios.get('http://localhost:4041/iot/about')
      .then(response => messageHandler(response.data, null))
      .catch(error => messageHandler(null, error));
      break;
    case '2':
      axios.post('http://localhost:4041/iot/services', {
        "services": [
          {
            "apikey":      "4jggokgpepnvsb2uv4s40d59ov",
            "cbroker":     "http://orion:1026",
            "entity_type": "Thing",
            "resource":    "/iot/json"
          }
        ]
      }, config)
      .then(() => messageHandler('\033[32m openiot \033[0m service created successfully, using \033[32m /iot/json \033[0m endpoint and \033[32m 4jggokgpepnvsb2uv4s40d59ov \033[0m api key ', null))
      .catch(error => messageHandler(null, error));
      break;
    case '3':
      axios.post('http://localhost:4041/iot/devices', {
        "devices": [
          {
            "device_id":   "motion001",
            "entity_name": "urn:ngsi-ld:Motion:001",
            "entity_type": "Motion",
            "timezone":    "Europe/Berlin",
            "attributes": [
              { "object_id": "c", "name": "count", "type": "Integer" }
            ],
            "static_attributes": [
              { "name":"refStore", "type": "Relationship", "value": "urn:ngsi-ld:Store:001"}
            ]
          }
        ]
      }, config)
      .then(() => messageHandler('Device \033[32m motion001 \033[0m created successfully', null))
      .catch(error => messageHandler(null, error));
      break;
    case '4':
      const value = await readLineAsync('insert value: ');
      client.publish('/4jggokgpepnvsb2uv4s40d59ov/motion001/attrs', `{"c": ${Number(value)} }`);
      messageHandler(`publishing ${value} over MQTT`, null);
      break;
    case '5':
      axios.get('http://localhost:1026/v2/entities/urn:ngsi-ld:Motion:001?type=Motion', {
        headers: {
          'fiware-service': 'openiot',
          'fiware-servicepath': '/'
        }
      })
      .then(response => messageHandler(response.data, null))
      .catch(error => messageHandler(null, error));
      break;
    case 'q':
      rl.close();
      console.log('BYE!');
      process.exit();
      break;
    default:
      init();
  }
}

init();