import {XRoadClient} from "./client";
import {fetchData} from "../fetch-data";
import {IXRoadRestRequest} from "../types/IXRoadRestRequest";
import {IXRoadService} from "../types/IXRoadService";

export class XRoadRestClient extends XRoadClient<IXRoadRestRequest> {

    public request = (req: IXRoadRestRequest) => {
        return this.restRequest(req);
    };

    public restRequest = (req: IXRoadRestRequest): Promise<any> => {
        const { service, headers, body, method, ...cleanProps } = req;
        return fetchData(this.url(service), {
            method: (method || 'GET'),
            headers: {
                "Content-Type": 'application/json',
                "x-road-client": this.clientHeader,
                ...(headers || {})
            },
            agentOptions: this.agentOptions,
            body,
            ...cleanProps,
        });
    };

   url(service: IXRoadService): string {
        return [
            this.securityServerUrl,
            'r1',
            service.xRoadInstance,
            service.memberClass,
            service.memberCode,
            service.subsystemCode,
            service.serviceCode,
        ].join('/')
    }

    get clientHeader(): string {
        return [
            this.xRoadInstance,
            this.memberClass,
            this.memberCode,
            this.subsystemCode
        ].join('/')
    }
}