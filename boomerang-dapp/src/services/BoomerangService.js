
class BoomerangService {
  constructor(identityService, boomerangSDK) {
    this.identityService = identityService;
    this.boomerangSDK = boomerangSDK;
    this.newEvents = [];
  }

  async getProfile(userAddress = this.identityService.identity.address) {
    return this.boomerangSDK.getProfile(userAddress);
  }

  async editProfile(name, description, location) {
    const profile = {};
    profile.name = name;
    profile.description = description;
    profile.location = location;
    this.boomerangSDK.editProfile(profile, this.identityService.identity.address, this.identityService.identity.privateKey);
  }

  async requestBusinessReview(customerAddress, customerBoomReward, customerXpReward, txDetails) {
    await this.boomerangSDK.requestBusinessReview(customerAddress, customerBoomReward, customerXpReward, txDetails, this.identityService.identity.address, this.identityService.identity.privateKey);
  }

  async getCustomerReviewRequests(customerAddress=this.identityService.identity.address) {
    const reviewRequests = await this.boomerangSDK.getCustomerReviewRequests(customerAddress);
    return reviewRequests;
  }

  async getBoomBalance(userAddress=this.identityService.identity.address) {
    return this.boomerangSDK.getBoomTokenBalance(userAddress);
  }

  async addBoomFunds(numTokens=100) {
    const curBoomBalance = await this.getBoomBalance(this.identityService.identity.address);
    return this.boomerangSDK.addBusinessFunds(numTokens, this.identityService.identity.address, this.identityService.identity.privateKey);
  }

  async getBoomFunds(userAddress=this.identityService.identity.address) {
    return this.boomerangSDK.getBusinessFunds(userAddress);
  }

  async isActiveReview(reviewId) {
    return this.boomerangSDK.isActiveReview(reviewId);
  }

  subscribe(eventType, callback) {
    let isNew = true;
    return this.boomerangSDK.subscribe(eventType, (event) => {
      for(const newEvent of this.newEvents) {
        if (JSON.stringify(newEvent) === JSON.stringify(event)) {
          isNew = false;
          break;
        }
      }
      if (isNew) {
        this.newEvents.push(event);
        callback(event);
      }
    });
  }
}

export default BoomerangService;
