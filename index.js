#!/usr/bin/env node
const colors = require('colors/safe');
const readline = require('readline');
const mqttClient = require('mqtt').connect('mqtt://localhost:1883');

const createAdapter = require('./src').client;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const service = 'openiot';
const endpoint = '/iot/json';
const key =  '4jggokgpepnvsb2uv4s40d59ov';
const device = 'motion001'
const name = 'urn:ngsi-ld:Motion:001'
const type = 'Motion'

const adapter = createAdapter(service, endpoint, key);

function readLineAsync(message) {
  return new Promise((resolve) => {
    rl.question(message, answer => resolve(answer));
  });
} 

function messageHandler(message, error) {
  if (error) {
    console.error(error);
  } else {
    console.log(message);
  }
  
  init();
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
  switch(selection) {
    case '1':
      adapter.checkStatus()
        .then(response => messageHandler(response.data))
        .catch(error => messageHandler(null, error));
      break;
    case '2':
      adapter.createGroup()
      .then(() => messageHandler(`${colors.green(service)} service created successfully, using ${colors.green(endpoint)} endpoint and ${colors.green(key)} api key`))
      .catch(error => messageHandler(null, error));
      break;
    case '3':
      adapter.createSensor(device, name, type)
      .then(() => messageHandler(`Device ${colors.green(device)} created successfully`))
      .catch(error => messageHandler(null, error));
      break;
    case '4':
      const value = await readLineAsync('insert value: ');
      mqttClient.publish(`/${key}/${device}/attrs`, `{"c": ${Number(value)} }`);
      messageHandler(`publishing ${colors.green(value)} over MQTT`);
      break;
    case '5':      
      adapter.retrieveData(name, type)
      .then(response => messageHandler(response.data))
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