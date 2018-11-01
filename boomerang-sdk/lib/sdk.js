import DEFAULT_PAYMENT_OPTIONS from './config';
import BoomToken from 'boomerang-contracts/build/BoomerangToken';
import Boomerang from 'boomerang-contracts/build/Boomerang';
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
  
  async addBusinessFunds(numTokens, identityAddress, identityPrivateKey) {
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
    await this.universalLoginSDK.execute(identityAddress, message, identityPrivateKey);
  }

  async requestBusinessReview(customerAddress, txDetailsJson, customerTokenReward, customerXpReward, identityAddress, identityPrivateKey) {
    const boomReward = utils.parseUnits(String(customerTokenReward), 18);
    const {data} = new Interface(Boomerang.interface).functions.requestReview(customerAddress, boomReward, customerXpReward, identityAddress, 0, 0, txDetailsJson);
    const message = {
      to: this.boomerangContractAddress,
      from: identityAddress,
      value: 0,
      data,
      gasToken: this.boomTokenAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.universalLoginSDK.execute(identityAddress, message, identityPrivateKey);
  }

  async getBusinessFunds(identityAddress) {
    return utils.formatEther(await this.boomTokenContract.allowance(identityAddress, this.boomerangContractAddress));
  }

  async getCustomerReviewRequests(userAddress) {
    const reviewRequestEvent = new Interface(Boomerang.interface).events.ReviewRequested;
    const reviewRequests = [];
    const filter = {
      fromBlock: 0,
      address: this.boomerangContractAddress,
      topics: [reviewRequestEvent.topics]
    };
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      const eventArguments = reviewRequestEvent.parse(reviewRequestEvent.topics, event.data);
      if (eventArguments.customer === userAddress) {
        reviewRequests.push({
          reviewRequest: eventArguments.reviewRequest,
          business: eventArguments.business,
          customer: eventArguments.customer,
          worker: eventArguments.worker,
          txDetails: eventArguments.txDetailsIPFS
        });
      }
    }
    return reviewRequests.reverse();
  }
}
export default BoomerangSDK;
