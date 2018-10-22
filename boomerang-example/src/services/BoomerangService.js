import ethers, {Interface, utils} from 'ethers';
import Boomerang from '../../build/Boomerang';
import BoomToken from '../../build/BoomerangToken';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {tokenContractAddress} from '../../config/config';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class BoomerangService {
  constructor(identityService, boomerangContractAddress, provider, ensService) {
    this.identityService = identityService;
    this.boomerangContractAddress = boomerangContractAddress;
    this.provider = provider;
    this.boomerangContract = new ethers.Contract(
      this.boomerangContractAddress,
      Boomerang.interface,
      this.provider
    );

    this.tokenContract = new ethers.Contract(
      tokenContractAddress,
      BoomToken.interface,
      this.provider
    );
    this.ensService = ensService;
    this.approveEvent = new Interface(BoomToken.interface).events.Approval;
    this.reviewRequestEvent = new Interface(Boomerang.interface).events.ReviewRequested;
  }

  async addBusinessFunds(numTokens=20) {
    const boomFunds = utils.parseUnits(String(numTokens), 18)
    const {data} = new Interface(BoomToken.interface).functions.increaseApproval(this.boomerangContractAddress, String(boomFunds));
    const message = {
      to: tokenContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data,
      gasToken: tokenContractAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.identityService.execute(message);
  }

  async requestBusinessReview(customerAddress, txDetailsJson, customerTokenReward=10, customerXpReward=10) {
    const boomReward = utils.parseUnits(String(customerTokenReward), 18)
    const {data} = new Interface(Boomerang.interface).functions.requestReview(customerAddress, boomReward, customerXpReward, this.identityService.identity.address, 0, 0, txDetailsJson);
    const message = {
      to: this.boomerangContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data,
      gasToken: tokenContractAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.identityService.execute(message);
  }

  async likeReview() {
    const {data} = new Interface(Boomerang.interface).functions.likeReview('0x76096629060567956C1e18BF8C428196f1f71539');
    const message = {
      to: this.boomerangContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data,
      gasToken: tokenContractAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.identityService.execute(message);
  }

  async cancelReview() {
    const {data} = new Interface(Boomerang.interface).functions.cancelReview();
    const message = {
      to: this.boomerangContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data,
      gasToken: tokenContractAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.identityService.execute(message);
  }

  getTimeDistanceInWords(time) {
    const date = new Date(time * 1000);
    return distanceInWordsToNow(date, {includeSeconds: true});
  }

  async getEnsName(address) {
    return await this.ensService.getEnsName(address);
  }


  async getBusinessFunds() {
    return utils.formatEther(await this.tokenContract.allowance(this.identityService.identity.address, this.boomerangContractAddress));
  }

  async getCustomerReviewRequests(userAddress) {
    const reviewRequests = [];
    const filter = {
      fromBlock: 0,
      address: this.boomerangContractAddress,
      topics: [this.reviewRequestEvent.topics]
    };
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      const eventArguments = this.reviewRequestEvent.parse(this.reviewRequestEvent.topics, event.data);
      if (eventArguments.customer === userAddress) {
        reviewRequests.push({
          customer: eventArguments.customer,
          txDetails: eventArguments.txDetailsIPFS
        });
      }
    }
    return reviewRequests.reverse();
  }

  // async getEventsFromLogs(events) {
  //   const approvals = [];
    // for (const event of events) {
    //   const eventArguments = this.approveEvent.parse(this.approveEvent.topics, event.data);
    //   approvals.push({
    //     spender: eventArguments.spender,
    //     value: eventArguments.value
    //   });
    // }
  //   return approvals.reverse();
  // }

  // async getApproveEvents() {
  //   const filter = {
  //     fromBlock: 0,
  //     address: tokenContractAddress,
  //     topics: [this.approveEvent.topics]
  //   };
  //   const events = await this.provider.getLogs(filter);
  //   return this.getEventsFromLogs(events);
  // }
}

export default BoomerangService;
