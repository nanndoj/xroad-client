import {IXRoadClient} from "./IXRoadClient";
import {AgentOptions} from "https";

export interface IXRoadConfig {
    securityServer: string;
    client: IXRoadClient,
    secure: boolean;
    agentOptions: AgentOptions
}