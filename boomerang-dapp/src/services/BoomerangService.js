
class BoomerangService {
  constructor(identityService, boomerangSDK) {
    this.identityService = identityService;
    this.boomerangSDK = boomerangSDK;
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
}

export default BoomerangService;
