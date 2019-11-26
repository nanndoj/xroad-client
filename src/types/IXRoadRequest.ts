import {IXRoadService} from "./IXRoadService";

export interface IXRoadRequest {
    secure?: boolean
    service: IXRoadService,
    headers?: Record<string, any>;
    body?: string;
}