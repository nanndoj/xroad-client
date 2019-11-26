import {IXRoadRequest} from "./IXRoadRequest";

export interface IXRoadSoapRequest extends IXRoadRequest {
    // Body is required for soap requests
    body: string;
}