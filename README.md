# @fluent-wallet/detect-provider

A tiny utility for detecting the Fluent Conflux/Ethereum provider, or any provider injected at `window.conflux` and `window.ethereum`. 

It has 0 dependencies and works out of the box in any modern browser, for synchronously and asynchronously injected providers.

## Usage

Keep in mind that the providers detected by this package may or may not support [the Ethereum JavaScript Provider API](https://eips.ethereum.org/EIPS/eip-1193).
Please consult [the Conflux Provider Doc](https://fluentwallet.com/conflux/reference/provider-api) and [the Ethereum Provider Doc](https://fluentwallet.com/espace/reference/provider-api) to learn how to use our provider.

### Node.js
#### Conflux Provider
```javascript
import detectProvider from '@fluent-wallet/detect-provider'

const provider = await detectProvider({
        injectFlag: "conflux",
        defaultWalletFlag: "isFluent",
})

if (provider) {

  console.log('Conflux successfully detected!')

  // From now on, this should always be true:
  // provider === window.conflux

  // Access the decentralized web!

  // Legacy providers may only have ethereum.sendAsync
  const chainId = await provider.request({
    method: 'cfx_chainId'
  })
} else {
  // if the provider is not detected, detectProvider will reject an error
  console.error('Please install Fluent Wallet!')
}
```
#### Ethereum Provider
```javascript
import detectProvider from '@fluent-wallet/detect-provider'

const provider = await detectProvider({
        injectFlag: "ethereum",
        defaultWalletFlag: "isMetaMask",
})

if (provider) {

  console.log('Ethereum successfully detected!')

  // From now on, this should always be true:
  // provider === window.ethereum

  // Access the decentralized web!

  // Legacy providers may only have ethereum.sendAsync
  const chainId = await provider.request({
    method: 'eth_chainId'
  })
} else {

  // if the provider is not detected, detectProvider will reject an error
  console.error('Please install MetaMask!')
}
```

### HTML

```html
<script src="https://unpkg.com/@fluent-wallet/detect-provider/dist/detect-provider.min.js"></script>
<script type="text/javascript">
  const provider = await detectProvider({
        injectFlag: "conflux",
        defaultWalletFlag: "isFluent",
  }

  if (provider) {
    // handle provider
  } else {
    // handle no provider
  }
</script>
```

### Options

The exported function takes an optional `options` object.
If invalid options are provided, an error will be thrown.
All options have default values.


#### `options.silent`

Type: `boolean`

Default: `false`

Whether error messages should be logged to the console.
Does not affect errors thrown due to invalid options.

#### `options.timeout`

Type: `number`

Default: `3000`

How many milliseconds to wait for asynchronously injected providers.

## Advanced Topics

### Overwriting or Modifying `window.ethereum` or  `window.conflux`

The detected provider object returned by this package will strictly equal (`===`) `window.ethereum` or  `window.conflux` for the entire page lifecycle, unless `window.ethereum` or  `window.conflux` is overwritten.
In general, consumers should never overwrite `window.ethereum` or  `window.conflux` or attempt to modify the provider object.

If, as a dapp developer, you notice that the provider returned by this package does not strictly equal `window.ethereum` or  `window.conflux`, something is wrong.
This may happen, for example, if the user has multiple wallets installed.
After confirming that your code and dependencies are not modifying or overwriting `window.ethereum` or  `window.conflux`, you should ask the user to ensure that they only have a single provider-injecting wallet enabled at any one time.
