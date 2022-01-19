# accumulate-js

![tests](https://github.com/hawyar/accumulate-js/actions/workflows/test.yml/badge.svg)

> Accumulate client for Node.js and browser

## Usage

```bash
npm install @hawyar/accumulate-js@0.1.0
```

### Query
```js
const rpc = accumulateClient("testnet");

const tx = await rpc.getTransaction(
  "5e63152594a0627a1ecc5a168d3322888c0f23ef1c60cebd11a79244a5af4d08",
);

console.log(tx.data.from); // acc://7117c50f04f1254d56b704dc05298912deeb25dbc1d26ef6/ACME
console.log(tx.type); // sendToken

const txHistory = await rpc.getTransactionHistory({
    url: "acc://7117c50f04f1254d56b704dc05298912deeb25dbc1d26ef6/ACME",
    start: 0,
    count: 10,
 })

console.log(txHistroy.items); // 10 transactions

```

## Contributing

### Doc

```bash
npm run generate:docs
```

and to preview docs locally

```bash
npm run serve:docs
```

Generate types from JSDoc

```bash
npm run generate:types
```

### Testing

```bash
npm run test
```

### Build

```bash
npm run build
```
