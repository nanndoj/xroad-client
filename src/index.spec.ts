import fetchMock from 'fetch-mock';
import XRoad, { IXRoadConfig, IXRoadRestRequest, IXRoadService } from './index';

// Create the configuration object pointing to
// the consumer security server
const xRoadConfig: IXRoadConfig = {
    securityServer: '127.0.0.1', // The security server address
    secure: true,
    client: {
        xRoadInstance: 'BR', // The x-road instance
        memberClass: 'GOV', // The consumer member class
        memberCode: '123456', // The consumer member code
        subsystemCode: '98765', // The consumer subsystem code
    },
    agentOptions: {},
};

const protocol = xRoadConfig.secure ? 'https' : 'http';

const service: IXRoadService = {
    xRoadInstance: 'BR', // The x-road instance
    memberClass: 'GOV', // The provider member class
    memberCode: '45678', // The provider member code
    subsystemCode: '8765', // The provider subsystem code
    serviceCode: `myVehicles`, // The service to be consumed
};

// create the consumer instance
const consumer = new XRoad(xRoadConfig);

describe('X-Road Client Library', () => {
    afterEach(() => fetchMock.reset());

    test('should handle errors on the provider api', async () => {
        // Create the request object
        const requestConfig: IXRoadRestRequest = {
            method: 'POST',
            service,
            headers: {
                // Custom headers can be passed here
            },
            body: JSON.stringify({ test: 1 }),
            timeout: 300000,
        };

        fetchMock.post(
            [
                `${protocol}:/`,
                xRoadConfig.securityServer,
                'r1',
                requestConfig.service.xRoadInstance,
                requestConfig.service.memberClass,
                requestConfig.service.memberCode,
                requestConfig.service.subsystemCode,
                requestConfig.service.serviceCode,
            ].join('/'),
            {
                status: 500,
                body: 'Internal server error',
            }
        );

        const restClient = consumer.getRestClient();
        try {
            const response = await restClient.request(requestConfig);
            console.log(response);
        } catch (err) {
            expect(err).toMatchObject({
                code: 500,
                message: 'Internal server error',
            });
        }
    });

    test('should consume REST services', async () => {
        // Create the request object
        const requestConfig: IXRoadRestRequest = {
            method: 'POST',
            service,
            headers: {
                // Custom headers can be passed here
            },
            body: JSON.stringify({ test: 1 }),
            timeout: 300000,
        };

        const expectedResponse = {
            test: 1,
        };

        fetchMock.post(
            [
                `${protocol}:/`,
                xRoadConfig.securityServer,
                'r1',
                requestConfig.service.xRoadInstance,
                requestConfig.service.memberClass,
                requestConfig.service.memberCode,
                requestConfig.service.subsystemCode,
                requestConfig.service.serviceCode,
            ].join('/'),
            expectedResponse
        );

        const restClient = consumer.getRestClient();
        const response = await restClient.request(requestConfig);

        expect(response).toEqual(expectedResponse);
    });

    test('should consume SOAP services', async () => {
        // Create the request object
        const requestConfig = {
            secure: false, // If true uses https instead of http
            service,
            headers: {
                // Custom headers can be passed here
            },
            body: `<con:myVehiclesBody xmlns:con="https://www.sr.gov.br/services/cons">
                   <id>456789</id>
                </con:myVehiclesBody>`,
        };

        fetchMock.post(
            `${protocol}://${xRoadConfig.securityServer}`,
            `
            <con:myVehiclesBodyResponse xmlns:con="https://www.sr.gov.br/services/cons">
               <license>1234</license>
            </con:myVehiclesBodyResponse>
        `
        );

        const restClient = consumer.getSoapClient();
        const response = await restClient.request(requestConfig);

        expect(response['con:myVehiclesBodyResponse'].license).toEqual('1234');
    });
});
