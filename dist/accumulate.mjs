var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var _validHost, validHost_fn;
import { Buffer as Buffer2 } from "buffer";
import fetch from "cross-fetch";
var Env;
(function(Env2) {
  Env2["Testnet"] = "testnet";
  Env2["Mainnet"] = "mainnet";
  Env2["Devnet"] = "devnet";
})(Env || (Env = {}));
const rpcErrCodes = {
  "-32700": {
    code: -32700,
    message: "Parse error",
    meaning: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
  },
  "-32600": {
    code: -32600,
    message: "Invalid Request",
    meaning: "The JSON sent is not a valid Request object."
  },
  "-32601": {
    code: -32601,
    message: "Method not found",
    meaning: "The method does not exist / is not available."
  },
  "-32602": {
    code: -32602,
    message: "Invalid params",
    meaning: "Invalid method parameter(s)."
  },
  "-32603": {
    code: -32603,
    message: "Internal error",
    meaning: "Internal JSON-RPC error."
  },
  "-32000": {
    code: -32e3,
    message: "Server error",
    meaning: "Reserved for implementation-defined server-errors."
  },
  "-32099": {
    code: -32099,
    message: "Server error",
    meaning: "Reserved for implementation-defined server-errors."
  }
};
class AccumulateClient {
  constructor(clientEnv) {
    __privateAdd(this, _validHost);
    this.genId = () => {
      this.id += 1;
      return this.id;
    };
    this.version = 2;
    this.env = Env.Testnet;
    this.baseUrl = `https://${Env.Testnet}.accumulatenetwork.io/v${this.version}`;
    this.fetch = fetch;
    this.id = 0;
    this.clientEnv = clientEnv || "";
    this.defaultHeaders = {
      "Content-Type": "application/json"
    };
    this.retries = {};
    __privateMethod(this, _validHost, validHost_fn).call(this);
  }
  getTransactionHistory(txParam) {
    return __async(this, null, function* () {
      if (!txParam.url) {
        throw new Error("Invalid url");
      }
      if (!txParam.start) {
        txParam.start = 0;
      }
      if (!txParam.count) {
        txParam.count = 10;
      }
      const body = {
        jsonrpc: "2.0",
        id: this.genId(),
        method: "query-tx-history",
        params: txParam
      };
      const response = yield this.fetch(this.baseUrl, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(body)
      });
      const json = yield response.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.result;
    });
  }
  getTransaction(TxId) {
    return __async(this, null, function* () {
      if (TxId instanceof Uint8Array) {
        const buff = new Buffer2(TxId);
        TxId = buff.toString();
      }
      const body = {
        jsonrpc: "2.0",
        id: this.genId(),
        method: "query-tx",
        params: {
          "txid": TxId
        }
      };
      const response = yield this.fetch(this.baseUrl, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(body)
      });
      const json = yield response.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.result;
    });
  }
}
_validHost = new WeakSet();
validHost_fn = function() {
  if (this.clientEnv === Env.Testnet || this.clientEnv === Env.Mainnet) {
    this.baseUrl = `https://${this.clientEnv}.accumulatenetwork.io/v${this.version}`;
  }
};
function accumulateClient(net) {
  const client = new AccumulateClient(net);
  return client;
}
export {
  Env,
  accumulateClient
};
