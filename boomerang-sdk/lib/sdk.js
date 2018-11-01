import DEFAULT_PAYMENT_OPTIONS from './config';
import BoomToken from 'boomerang-contracts/build/BoomerangToken';
//import Boomerang from 'boomerang-contracts/build/Boomerang';
import ethers, {Interface, utils} from 'ethers';
import UniversalLoginSDK from 'universal-login-sdk';

class BoomerangSDK {
  constructor(relayerUrl, provider, boomerangContractAddress, boomTokenAddress, paymentOptions) {
    this.provider = provider;
    this.relayerUrl = relayerUrl;
    this.boomerangContractAddress = boomerangContractAddress;
    this.boomTokenAddress = boomTokenAddress;
    this.defaultPaymentOptions = {...DEFAULT_PAYMENT_OPTIONS, ...paymentOptions};
    this.universalLoginSDK = new UniversalLoginSDK(relayerUrl, provider, this.defaultPaymentOptions);
    this.boomTokenContract = new ethers.Contract(
      boomTokenAddress,
      BoomToken.interface,
      provider
    );
  }
  
  async addBusinessFunds(identityAddress, privateKey, numTokens = 20) {
    const boomFunds = utils.parseUnits(String(numTokens), 18);
    const {data} = new Interface(BoomToken.interface).functions.increaseApproval(this.boomerangContractAddress, String(boomFunds));
    const message = {
      to: this.boomTokenAddress,
      from: identityAddress,
      value: 0,
      data,
      gasToken: this.boomTokenAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.universalLoginSDK.execute(identityAddress, message, privateKey);
  }

  async getBusinessFunds(identityAddress) {
    return utils.formatEther(await this.boomTokenContract.allowance(identityAddress, this.boomerangContractAddress));
  }
}
export default BoomerangSDK;
