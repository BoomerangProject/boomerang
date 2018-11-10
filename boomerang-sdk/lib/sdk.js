import DEFAULT_PAYMENT_OPTIONS from './config';
import BoomToken from 'boomerang-contracts/build/BoomerangToken';
import Boomerang from 'boomerang-contracts/build/Boomerang';
import BlockchainObserver from './observers/BlockchainObserver';
import ethers, {Interface, utils} from 'ethers';
import UniversalLoginSDK from 'universal-login-sdk';
import image2base64 from 'image-to-base64';
import ipfsAPI from 'ipfs-api';

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

class BoomerangSDK {
  constructor(relayerUrl, provider, boomerangContractAddress, boomTokenAddress, paymentOptions) {
    this.relayerUrl = relayerUrl;
    this.provider = provider;
    this.boomerangContractAddress = boomerangContractAddress;
    this.boomTokenAddress = boomTokenAddress;
    this.defaultPaymentOptions = {...DEFAULT_PAYMENT_OPTIONS, ...paymentOptions};
    this.blockchainObserver = new BlockchainObserver(provider);
    this.universalLoginSDK = new UniversalLoginSDK(relayerUrl, provider, this.defaultPaymentOptions);
    this.boomTokenContract = new ethers.Contract(
      boomTokenAddress,
      BoomToken.interface,
      provider
    );
    this.boomerangContract = new ethers.Contract(
      boomerangContractAddress,
      Boomerang.interface,
      provider
    );
    this.reviewCompletedEvent = new Interface(Boomerang.interface).events.ReviewCompleted;
  }

  async editProfile({profileType, name, description, location, imgFiles}, identityAddress, identityPrivateKey) {
    const oldProfile = this.getProfile(identityAddress);
    const userProfile = {};
    userProfile.profileType = profileType || oldProfile.profileType;
    userProfile.name = name || oldProfile.name;
    userProfile.description = description || oldProfile.description;
    userProfile.location = location || oldProfile.location;
    if (imgFiles) {
      for (let i = 0; i < imgFiles.length - 1; i++) {
        userProfile.imgFiles[i] =  imgFiles[i] && !! imgFiles[i].length ? await image2base64(imgFiles[i]) : oldProfile.imgFiles[i];
      }
    } else {
      userProfile.imgFiles = oldProfile.imgFiles;
    }
    const buffer = new Buffer(JSON.stringify(userProfile));
    await ipfs.add(buffer, async (err, profileHash) => {
      if (err) {
        return console.log(err);
      }
      await this.executeEditProfile(profileHash[0].hash, identityAddress, identityPrivateKey);
    });
  }

  async executeEditProfile(profileHash, identityAddress, identityPrivateKey) {
    const {data} = new Interface(Boomerang.interface).functions.editProfile(profileHash);
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

  async getProfile(userAddress) {
    const profileEditEvent = new Interface(Boomerang.interface).events.ProfileEdited;
    let profileEdit = {};
    let profileHash = '';
    const filter = {
      fromBlock: 0,
      address: this.boomerangContractAddress,
      topics: [profileEditEvent.topics]
    };
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      const eventArguments = profileEditEvent.parse(profileEditEvent.topics, event.data);
      if (eventArguments.user === userAddress) {
        profileHash = eventArguments.profileHash;
      }
    }
    if (profileHash) {
      const content = await ipfs.cat(profileHash);
      profileEdit = JSON.parse(content.toString('utf8'));
    }
    return profileEdit;
  }

  async getBoomTokenBalance(userAddress) {
    return utils.formatEther(await this.boomTokenContract.balanceOf(userAddress));
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

  async getBusinessFunds(identityAddress) {
    return utils.formatEther(await this.boomTokenContract.allowance(identityAddress, this.boomerangContractAddress));
  }

  async requestBusinessReview(customerAddress, customerTokenReward, customerXpReward, txDetails, identityAddress, identityPrivateKey) {
    const buffer = new Buffer(txDetails);
    await ipfs.add(buffer, async (err, txDetailsHash) => {
      if (err) {
        return console.log(err);
      }
      await this.executeRequestBusinessReview(
        customerAddress, 
        customerTokenReward, 
        customerXpReward, 
        txDetailsHash[0].hash, 
        identityAddress, 
        identityPrivateKey
      );
    });
  }

  async executeRequestBusinessReview(customerAddress, customerTokenReward, customerXpReward, txDetailsHash, identityAddress, identityPrivateKey) {
    const boomReward = utils.parseUnits(String(customerTokenReward), 18);
    const {data} = new Interface(Boomerang.interface).functions.requestBusinessReview(customerAddress, boomReward, customerXpReward, txDetailsHash);
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
          reviewId: Number(eventArguments.reviewId),
          business: eventArguments.business,
          customer: eventArguments.customer,
          worker: eventArguments.worker,
          txDetailsHash: eventArguments.txDetailsHash
        });
      }
    }
    return reviewRequests.reverse();
  }

  async isActiveReview(reviewId) {
    return await this.boomerangContract.isActiveReview(reviewId);
  }

  subscribe(eventType, callback) {
    return this.blockchainObserver.subscribe(eventType, this.boomerangContractAddress, callback);
  }

  async start() {
    await this.blockchainObserver.start();
  }

  stop() {
    this.blockchainObserver.stop();
  }

  async finalizeAndStop() {
    await this.blockchainObserver.finalizeAndStop();
  }

  // async submitReview(reviewId, rating, review, identityAddress, identityPrivateKey) {
  //   // TODO: Put review into IPFS and use that for submit review.
  //   const {data} = new Interface(Boomerang.interface).functions.completeReview(reviewId, rating, review);
  //   const message = {
  //     to: this.boomerangContractAddress,
  //     from: identityAddress,
  //     value: 0,
  //     data,
  //     gasToken: this.boomTokenAddress,
  //     ...DEFAULT_PAYMENT_OPTIONS
  //   };
  //   await this.universalLoginSDK.execute(identityAddress, message, identityPrivateKey);
  // }



  // async getCompletedReviews() {
  //   const completedReviews = [];
  //   const filter = {
  //     fromBlock: 0,
  //     address: this.boomerangContractAddress,
  //     topics: [this.reviewCompletedEvent.topics]
  //   };
  //   return this.provider.getLogs(filter);
  // }

  // async getCompletedBusinessReviews(businessAddress) {

  // }

  // async getCompletedCustomerReviews(customerAddress) {
  //   const completedCustomerReviews = [];
  //   const events = this.getCompletedReviews();
  //   for (const event of events) {
  //     const eventArguments = this.reviewCompletedEvent.parse(this.reviewCompletedEvent.topics, event.data);
  //     if (eventArguments.customer === customerAddress) {
  //       reviewRequests.push({
  //         reviewId: eventArguments.reviewId,
  //         business: eventArguments.business,
  //         customer: eventArguments.customer,
  //         worker: eventArguments.worker,
  //         rating: eventArguments.rating,
  //         reviewHash: eventArguments.reviewHash
  //       });
  //     }
  //   }
  //   return reviewRequests.reverse();
  // }

  // async getCompletedWorkerReviews(workerAddress) {

  // }

}
export default BoomerangSDK;
