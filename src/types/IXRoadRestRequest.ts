import {IXRoadRequest} from "./IXRoadRequest";

export interface IXRoadRestRequest extends  IXRoadRequest {
    // Method can be specified for Rest requests
    method?: string;
    secure?: boolean;
}