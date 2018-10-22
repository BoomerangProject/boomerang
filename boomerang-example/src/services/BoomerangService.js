import ethers, {Interface} from 'ethers';
import Boomerang from '../../build/Boomerang';
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
    this.likeReviewEvent = new Interface(Boomerang.interface).events.ReviewLiked;
    this.ensService = ensService;
  }

  async likeReview() {
    const message = {
      to: this.clickerContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data: this.boomerangContract.interface.functions.likeReview('0x76096629060567956C1e18BF8C428196f1f71539').data,
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

  async getEventsFromLogs(events) {
    const pressers = [];
    for (const event of events) {
      const eventArguments = this.likeReviewEvent.parse(this.likeReviewEvent.topics, event.data);
      pressers.push({
        review: eventArguments.reviewRequest,
        name: await this.getEnsName(eventArguments.customer)
      });
    }
    return pressers.reverse();
  }

  async getLikeReviewEvents() {
    const filter = {
      fromBlock: 0,
      address: this.boomerangContractAddress,
      topics: [this.likeReviewEvent.topics]
    };
    const events = await this.provider.getLogs(filter);
    return this.getEventsFromLogs(events);
  }
}

export default BoomerangService;
