import * as tap from 'tap'
import { accumulateClient } from "../dist/accumulate.cjs";

tap.test('Pass thru', async (t) => {

  const rpc = accumulateClient("testnet");
  const tx = await rpc.getTransaction(
    "5e63152594a0627a1ecc5a168d3322888c0f23ef1c60cebd11a79244a5af4d08",
  );

  if (tx instanceof Error) {
    console.error(tx);
  }

  t.same(tx.result.type, "sendTokens");
});
