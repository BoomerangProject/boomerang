![alt text](https://github.com/BoomerangProject/boomerang-wiki/blob/master/images/logo.png "Boomerang Logo")
# BoomerangSDK
To create a SDK instance:

```js
import BoomerangSDK from 'BoomerangSDK';
const sdk = new BoomerangSDK(
  'https://relayer.boomerang.xyz',
  'https://etherscan.io/{yourapikey}'
);
```

To create a new identity:


## Functions to be provided
`generateIdentity(string ensName, int numTokens, string[] publicKeys, string roles[], string privateKey);`

`requestWorkerReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string workerAddress, int workerRewardTokens, int workerRewardXP, string businessTxDetails, string privateKey, string ethTxDetails)`

`requestBusinessReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string txDetailsJSON, string privateKey, string ethTxDetails)`

`submitReview(int rating, string review, string privateKey, string ethTxDetails)`
