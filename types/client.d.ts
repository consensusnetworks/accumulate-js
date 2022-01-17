import fetch from 'cross-fetch';
interface TransactionQueryResponse {
    jsonrpc: string;
    result: {
        type: string;
        data: {
            from: string;
            to: {
                url: string;
                amount: number;
                txid: string;
            }[];
        };
        sponsor: string;
        keyPage: {
            height: number;
        };
        txid: string;
        signer: {
            publicKey: string;
            nonce: number;
        };
        sig: string;
        status: {
            code: string;
        };
        syntheticTxids: string[];
    };
    id: number;
}
export interface RpcErr {
    code: number;
    message: string;
    meaning: string;
}
export declare enum Env {
    Testnet = "testnet",
    Mainnet = "mainnet",
    Devnet = "devnet"
}
export declare type Client = {
    version: number;
    baseUrl: string;
    id: number;
    env: Env;
    defaultHeaders: {
        [key: string]: string;
    };
    genId: () => number;
    getTransaction: (TxId: string | Uint8Array) => Promise<TransactionQueryResponse>;
};
declare class AccumulateClient implements Client {
    #private;
    baseUrl: string;
    version: number;
    id: number;
    env: Env;
    defaultHeaders: {
        [key: string]: string;
    };
    fetch: typeof fetch;
    clientEnv: string;
    constructor(clientEnv?: string);
    genId: () => number;
    getTransaction(TxId: string | Uint8Array): Promise<TransactionQueryResponse>;
}
export declare function accumulateClient(net?: string): AccumulateClient;
export {};
