import {IXRoadService} from "./IXRoadService";

export interface IXRoadRequest {
    service: IXRoadService,
    headers?: Record<string, any>;
    body?: string;
}
