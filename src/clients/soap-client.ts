import { XRoadClient } from './client';
import { IXRoadSoapRequest } from '../types/IXRoadSoapRequest';
import { fetchData } from '../fetch-data';
import { IXRoadService } from '../types/IXRoadService';
import { v4 as uuidv4 } from 'uuid';
import parser from 'fast-xml-parser';

const parserOptions = {
    parseNodeValue: false,
    ignoreAttributes: true,
    trimValues: false,
};

export class XRoadSoapClient extends XRoadClient<IXRoadSoapRequest> {
    public request = (req: IXRoadSoapRequest) => {
        return this.soapRequest(req);
    };

    public soapRequest = (req: IXRoadSoapRequest): Promise<any> => {
        return fetchData(this.securityServerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml',
                ...(req.headers || {}),
            },
            agentOptions: this.agentOptions,
            body: this.createXRoadSoapEnvelopeBody(req.service, req.body),
        }).then(body => {
            return parser.parse(body as string, parserOptions);
        });
    };

    createXRoadSoapEnvelopeBody = (
        xroadService: IXRoadService,
        bodyContent: string
    ) => {
        // Get data from SEFAZ
        return `<SOAP-ENV:Envelope
            xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:xrd="http://x-road.eu/xsd/xroad.xsd"
            xmlns:id="http://x-road.eu/xsd/identifiers">
            <SOAP-ENV:Header>
                <xrd:client id:objectType="SUBSYSTEM">
                    <id:xRoadInstance>${this.xRoadInstance}</id:xRoadInstance>
                    <id:memberClass>${this.memberClass}</id:memberClass>
                    <id:memberCode>${this.memberCode}</id:memberCode>
                    <id:subsystemCode>${this.subsystemCode}</id:subsystemCode>
                </xrd:client>
                <xrd:service id:objectType="SERVICE">
                    <id:xRoadInstance>${
                        xroadService.xRoadInstance
                    }</id:xRoadInstance>
                    <id:memberClass>${xroadService.memberClass}</id:memberClass>
                    <id:memberCode>${xroadService.memberCode}</id:memberCode>
                    <id:subsystemCode>${
                        xroadService.subsystemCode
                    }</id:subsystemCode>
                    <id:serviceCode>${xroadService.serviceCode}</id:serviceCode>
                </xrd:service>
                <xrd:protocolVersion>4.0</xrd:protocolVersion>
                <xrd:id>${uuidv4()}</xrd:id>
            </SOAP-ENV:Header>
            <SOAP-ENV:Body>
                ${bodyContent}
            </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;
    };
}
