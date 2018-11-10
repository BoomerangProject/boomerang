
class BoomerangService {
  constructor(identityService, boomerangSDK, ensService) {
    this.identityService = identityService;
    this.boomerangSDK = boomerangSDK;
    this.ensService = ensService;
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

  async getPendingReviewRequests() {
    let pendingReviewsWithContent = [];
    const pendingReviews = await this.boomerangSDK.getPendingReviewRequests(this.identityService.identity.address);
    for (const pendingReview of pendingReviews) {
      let pendingReviewWithContent = {};
      pendingReviewWithContent.key = pendingReview.reviewId;
      pendingReviewWithContent.reviewId = pendingReview.reviewId;
      pendingReviewWithContent.txDetails = await this.boomerangSDK.getContent(pendingReview.txDetailsHash);
      pendingReviewWithContent.businessName = await this.ensService.getEnsName(pendingReview.business);
      pendingReviewWithContent.customerName = await this.ensService.getEnsName(pendingReview.customer);
      pendingReviewWithContent.workerName = await this.ensService.getEnsName(pendingReview.worker);
      pendingReviewWithContent.boomReward = await this.boomerangSDK.getCustomerBoomReward(pendingReview.reviewId);
      pendingReviewWithContent.xpReward = await this.boomerangSDK.getCustomerXpReward(pendingReview.reviewId);
      pendingReviewsWithContent.push(pendingReviewWithContent);
    }
    return pendingReviewsWithContent;
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
