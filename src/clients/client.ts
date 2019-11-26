import {IXRoadRequest} from "../types/IXRoadRequest";
import {IXRoadConfig} from "../types/IXRoadConfig";
import {IXRoadClient} from "../types/IXRoadClient";
import {AgentOptions} from "https";

export abstract class XRoadClient<T extends IXRoadRequest> {

    abstract request: (req: T) => Promise<any>;

    private readonly securityServer: string;
    private readonly client: IXRoadClient;
    protected readonly secure: boolean;
    protected readonly agentOptions: AgentOptions;

    constructor(config: IXRoadConfig) {
        this.securityServer = config.securityServer;
        this.client = config.client;
        this.secure = config.secure;
        this.agentOptions = config.agentOptions;
    }

    get xRoadInstance(): string {
        return this.client.xRoadInstance;
    }

    get memberClass(): string {
        return this.client.memberClass;
    }

    get memberCode(): string {
        return this.client.memberCode;
    }

    get subsystemCode(): string {
        return this.client.subsystemCode;
    }

    get securityServerUrl(): string {
        return `${this.protocol}://${this.securityServer}`;
    }

    private get protocol(): string {
        return this.secure ? 'https' : 'http';
    }
}