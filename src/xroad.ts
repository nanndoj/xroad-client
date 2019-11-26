import {XRoadSoapClient} from "./clients/soap-client";
import {XRoadRestClient} from "./clients/rest-client";
import {IXRoadConfig} from "./types/IXRoadConfig";

export default class XRoad {

    private soapClient: XRoadSoapClient;
    private restClient: XRoadRestClient;

    constructor(private config: IXRoadConfig) {}

    getSoapClient = (): XRoadSoapClient => {
        if(!this.soapClient) {
            this.soapClient = new XRoadSoapClient(this.config);
        }
        return this.soapClient;
    };

    getRestClient = (): XRoadRestClient => {
        if(!this.restClient) {
            this.restClient = new XRoadRestClient(this.config);
        }

        return this.restClient;
    }
}