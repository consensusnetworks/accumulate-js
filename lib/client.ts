import { Buffer } from 'buffer';
import fetch from 'cross-fetch';

interface RpcRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: { [key: string]: any };
}

interface RpcResponse{
  jsonrpc: string;
  result: any;
  id: number;
}


type AccumulateUrl = `acc://${string}/`;

interface TransactionHistoryRequest {
  url: AccumulateUrl;
  start: number;
  count: number;
}

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

export enum Env {
  Testnet = "testnet",
  Mainnet = "mainnet",
  Devnet = "devnet",
}
export type Client = {
  version: number;
  baseUrl: string;
  id: number;
  env: Env;
  defaultHeaders: { [key: string]: string };
  genId: () => number;

  getTransaction: (
    TxId: string | Uint8Array,
  ) => Promise<TransactionQueryResponse>;
};

const rpcErrCodes = {
  "-32700": {
    code: -32700,
    message: "Parse error",
    meaning:
      "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.",
  },
  "-32600": {
    code: -32600,
    message: "Invalid Request",
    meaning: "The JSON sent is not a valid Request object.",
  },
  "-32601": {
    code: -32601,
    message: "Method not found",
    meaning: "The method does not exist / is not available.",
  },
  "-32602": {
    code: -32602,
    message: "Invalid params",
    meaning: "Invalid method parameter(s).",
  },
  "-32603": {
    code: -32603,
    message: "Internal error",
    meaning: "Internal JSON-RPC error.",
  },
  "-32000": {
    code: -32000,
    message: "Server error",
    meaning: "Reserved for implementation-defined server-errors.",
  },
  "-32099": {
    code: -32099,
    message: "Server error",
    meaning: "Reserved for implementation-defined server-errors.",
  },
};

class AccumulateClient implements Client {
  baseUrl: string;
  version: number;
  id: number;
  env: Env;
  defaultHeaders: { [key: string]: string };
  fetch: typeof fetch;
  clientEnv: string;
  retries: { [key: string]: number };
  constructor(clientEnv?: string) {
    this.version = 2;
    this.env = Env.Testnet;
    this.baseUrl =
      `https://${Env.Testnet}.accumulatenetwork.io/v${this.version}`;
    this.fetch = fetch;
    this.id = 0;
    this.clientEnv = clientEnv || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.retries = {};
    this.#validHost();
  }

  genId = (): number => {
    this.id += 1;
    return this.id;
  };

  #validHost(): void {
    if (this.clientEnv === Env.Testnet || this.clientEnv === Env.Mainnet) {
      this.baseUrl =
        `https://${this.clientEnv}.accumulatenetwork.io/v${this.version}`;
    }
  }

  async getTransactionHistory(txParam: TransactionHistoryRequest): Promise<RpcResponse> {

    if (!txParam.url) {
      throw new Error("Invalid url");
    }

    if (!txParam.start) {
      txParam.start = 0;
    }

    if (!txParam.count) {
      txParam.count = 10;
    }

    const body: RpcRequest = {
      jsonrpc: "2.0",
      id: this.genId(),
      method: "query-tx-history",
      params:  txParam
    }

    const response = await this.fetch(this.baseUrl, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(json.error.message);
    }

    return json.result;
  }



  async getTransaction(
    TxId: string | Uint8Array,
  ): Promise<TransactionQueryResponse> {
    if (TxId instanceof Uint8Array) {
      const buff = new Buffer(TxId);
      TxId = buff.toString();
    }

    const body: RpcRequest = {
      jsonrpc: "2.0",
      id: this.genId(),
      method: "query-tx",
      params: {
        "txid": TxId,
      },
    };

    const response = await this.fetch(this.baseUrl, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(json.error.message);
    }

    return json.result;
  }

}

export function accumulateClient(net?: string): AccumulateClient {
  const client = new AccumulateClient(net);
  return client;
}
