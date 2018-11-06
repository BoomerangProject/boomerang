
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
}

export default BoomerangService;
