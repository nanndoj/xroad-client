# X-Road Client Library for Nodejs

X-Road Client provides a Nodejs library for building X-Road v6 Adapter clients. The library takes care of serialization and deserialization of SOAP and REST messages offering built-in support for standard X-Road SOAP and REST headers; only processing of application specific request and response content remains to be implemented

# Installation

```
npm install --save xroad-client
```

# Usage

1. Create the consumer instance

```javascript
import XRoad from 'xroad-client';

// Create the configuration object pointing to 
// the consumer security server
const xRoadConfig = {
    securityServer: "127.0.0.1", // The security server address
    client: {
        xRoadInstance: 'BR', // The x-road instance
        memberClass: 'GOV', // The consumer member class
        memberCode: '123456', // The consumer member code
        subsystemCode: '98765' // The consumer subsystem code
    }
}

// create the consumer instance
const consumer = new XRoad(xRoadConfig);

```

2. Consuming a REST service

```javascript
// Create the request object
const requestConfig = {
    method: "POST", // The request method
    secure: false, // If true uses https instead of http 
    service: {
        xRoadInstance: 'BR', // The x-road instance
        memberClass: 'GOV', // The provider member class
        memberCode: '45678', // The provider member code
        subsystemCode: '8765', // The provider subsystem code
        serviceCode: `myVehicles` // The service to be consumed 
    },
    headers: {
        // Custom headers can be passed here
    },
    body: JSON.stringify({ 
        // request body content
        id: 1236789 
    })
};

// Consuming a rest Service
const restClient =  consumer.getRestClient();
const response = restClient.request(requestConfig);

console.log(response);
```

3. Consuming a SOAP service

```javascript
// Create the request object
const requestConfig = {
    secure: false, // If true uses https instead of http 
    service: {
        xRoadInstance: 'BR', // The x-road instance
        memberClass: 'GOV', // The provider member class
        memberCode: '45678', // The provider member code
        subsystemCode: '8765', // The provider subsystem code
        serviceCode: `myVehicles` // The service to be consumed 
    },
    headers: {
        // Custom headers can be passed here
    },
    body: (
        `<con:myVehiclesBody xmlns:con="https://www.sr.gov.br/services/cons">
           <id>456789</id>
        </con:myVehiclesBody>`
      )
};

const restClient =  consumer.getRestClient();
const response = restClient.request(requestConfig);

console.log(response);
```
