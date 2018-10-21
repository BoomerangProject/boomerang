![alt text](https://github.com/BoomerangProject/boomerang-wiki/blob/master/images/logo.png "Boomerang Logo")
# BoomerangSDK
The following is under construction...

To create a SDK instance:

```js
import BoomerangSDK from 'BoomerangSDK';
const sdk = new BoomerangSDK(
  'https://relayer.boomerang.xyz',
  'https://etherscan.io/{yourapikey}',
  'https://ipfs.infura.io/{yourapikey}'
);
```

## Functions to be provided
### Generate Identity
`generateIdentity(string ensName, int numTokens, string[] publicKeys, string roles[], string privateKey);`

### Request Worker Review
`requestWorkerReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string workerAddress, int workerRewardTokens, int workerRewardXP, string businessTxDetails, string privateKey, string ethTxDetails);`

### Request Business Review
`requestBusinessReview(string customerAddress, int customerRewardTokens, int customerRewardXP, string txDetailsJSON, string privateKey, string ethTxDetails);`

### Submit Review
`submitReview(string reviewRequestAddress, int rating, string review, string privateKey, string ethTxDetails);`

### Cancel Review
`cancelReview(string reviewRequestAddress, string privateKey, string ethTxDetails);`

### Edit Review
`editReview(string reviewRequestAddress, int rating, string review, string privateKey, string ethTxDetails);`

### Get User Level
`getUserLevel(string businessAddress, string userAddress);`

### Get User XP
`getUserXP(string businessAddress, string userAddress);`

### Get Reviews
`getReviews(string userAddress);`
