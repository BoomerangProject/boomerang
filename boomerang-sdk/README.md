![alt text](https://github.com/BoomerangProject/boomerang-wiki/blob/master/images/logo.png "Boomerang Logo")
# BoomerangSDK
To create a SDK instance:

```js
import BoomerangSDK from 'BoomerangSDK';
const sdk = new BoomerangSDK(
  'https://relayer.boomerang.xyz',
  'https://etherscan.io/{yourapikey}',
  'https://ipfs.infura.io/{yourapikey}',
  '(default) BoomerangContractAddress',
  '(default) BoomerangTokenAddress'
);
```

## Functions to be provided
### Generate Identity
`generateIdentity(string ensName, int numTokens, string[] publicKeys, string roles[], string identityPrivateKey);`

### Add Business Funds
`addBusinessFunds(int numTokens, string identityPrivateKey, string identityAddress);`

### Request Worker Review
`requestWorkerReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string workerAddress, int workerRewardTokens, int workerRewardXP, string businessTxDetails, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Request Business Review
`requestBusinessReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string txDetailsJSON, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Submit Review
`submitReview(string reviewRequestAddress, int rating, string review, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Cancel Review
`cancelReview(string reviewRequestAddress, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Edit Review
`editReview(string reviewRequestAddress, int rating, string review, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Get User Level
`getUserLevel(string businessAddress, string userAddress, int xpPerLevel=100);`

### Get User XP
`getUserXP(string businessAddress, string userAddress);`

### Get Reviews
`getReviews(string userAddress);`
