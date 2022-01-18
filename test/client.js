import * as tap from 'tap'
import { accumulateClient } from "../dist/accumulate.cjs";

tap.test('getTransaction', async (t) => {

  const rpc = accumulateClient("testnet");
  const tx = await rpc.getTransaction(
    "5e63152594a0627a1ecc5a168d3322888c0f23ef1c60cebd11a79244a5af4d08",
  );

  if (tx instanceof Error) {
    console.error(tx);
  }

  t.same(tx.type, "sendTokens");
});

tap.test('getTransactionHistory', async (t) => {

  const rpc = accumulateClient("testnet");
  const txHistory = await rpc.getTransactionHistory({
    url: "acc://7117c50f04f1254d56b704dc05298912deeb25dbc1d26ef6/ACME",
    start: 0,
    count: 10,
  })

  if (txHistory instanceof Error) {
    console.error(txHistory);
  }
  t.same(txHistory.total, "1215265")
});

