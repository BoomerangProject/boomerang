module.exports = Object.freeze({
  jsonRpcUrl: process.env.JSON_RPC_URL,
  relayerUrl: process.env.RELAYER_URL,
  ensDomains: [process.env.ENS_DOMAIN_1],
  clickerContractAddress: process.env.CLICKER_CONTRACT_ADDRESS,
  tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS,
  boomerangContractAddress: process.env.BOOMERANG_CONTRACT_ADDRESS
});

