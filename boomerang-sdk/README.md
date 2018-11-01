![alt text](https://github.com/BoomerangProject/boomerang-wiki/blob/master/images/logo.png "Boomerang Logo")
# BoomerangSDK
To create a SDK instance:

```js
import BoomerangSDK from 'BoomerangSDK';
const sdk = new BoomerangSDK(
  'https://relayer.boomerang.xyz',
  'https://ropsten.infura.io/{yourapikey}',
  'https://ipfs.infura.io/{yourapikey}',
  '(default) BoomerangContractAddress',
  '(default) BoomerangTokenAddress'
);
```

## Functions to be provided
### Generate Identity
`generateIdentity(string ensName, int numTokens, string[] publicKeys, string roles[], string identityPrivateKey);`

### Add Business Funds ✔
`addBusinessFunds(numTokens, identityAddress, identityPrivateKey);`
Allows Boomerang contract to use `numTokens` number of BOOM tokens. A business will call this and allocate an amount of BOOM tokens that they are willing to use to request reviews from customers. This DOES NOT transfer funds from caller's identity to Boomerang contract, rather allows the Boomerang contract to spend tokens on the identities behalf (When it requests reviews).

### Request Worker Review
`requestWorkerReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string workerAddress, int workerRewardTokens, int workerRewardXP, string businessTxDetails, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Request Business Review ✔
`requestBusinessReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string txDetailsJSON, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Submit Review
`submitReview(string reviewRequestAddress, int rating, string review, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Cancel Review
`cancelReview(string reviewRequestAddress, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Edit Review
`editReview(string reviewRequestAddress, int rating, string review, string ethTxDetails, string identityPrivateKey, string identityAddress);`

### Get Business Funds
`getBusinessFunds(string businessAddress);`

### Get User Level
`getUserLevel(string businessAddress, string userAddress, int xpPerLevel=100);`

### Get User XP
`getUserXP(string businessAddress, string userAddress);`

### Get Reviews
`getReviews(string userAddress);`
