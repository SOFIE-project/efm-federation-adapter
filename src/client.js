const axios = require('axios');

const clientFactory = (service, endpoint, key) => {

  const proto = {
  service,
  endpoint,
  key,
  checkStatus () {
    return axios.get('http://localhost:4041/iot/about');
  },
  createGroup() {
    return axios.post('http://localhost:4041/iot/services', {
      "services": [
        {
          "apikey":      this.key,
          "cbroker":     "http://orion:1026",
          "entity_type": "Thing",
          "resource":    this.endpoint
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'fiware-service': this.service,
        'fiware-servicepath': '/'
      }
    })
  },
  createSensor(device, name, type) {
    return axios.post('http://localhost:4041/iot/devices', {
        "devices": [
          {
            "device_id":   device,
            "entity_name": name,
            "entity_type": type,
            "timezone":    "Europe/Berlin",
            "attributes": [
              { "object_id": "c", "name": "count", "type": "Integer" }
            ],
            "static_attributes": [
              { "name":"refStore", "type": "Relationship", "value": "urn:ngsi-ld:Store:001"}
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'fiware-service': this.service,
          'fiware-servicepath': '/'
        }
      })
  },
  retrieveData(name, type) {
    return axios.get(`http://localhost:1026/v2/entities/${name}?type=${type}`, {
      headers: {
        'fiware-service': this.service,
        'fiware-servicepath': '/'
      }
    })
  }
  };

  
  return Object.create(proto)
};
module.exports = clientFactory;