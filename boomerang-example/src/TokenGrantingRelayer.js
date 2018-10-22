import { waitForContractDeploy } from "./utils";
import BoomToken from '../build/BoomerangToken';
import Relayer from 'universal-login-relayer';
import ethers, {Wallet, utils} from 'ethers';

class TokenGrantingRelayer extends Relayer {

  constructor(provider, config, deployerPrivateKey, tokenContractAddress = []) {
    super(provider, config);
    this.provider = provider;
    this.tokenContractAddress = tokenContractAddress;
    this.deployerWallet = new Wallet(deployerPrivateKey, this.provider);
  }

  addHooks() {
    this.tokenContract = new ethers.Contract(this.tokenContractAddress, BoomToken.interface, this.deployerWallet);
    this.hooks.addListener('created', (transaction) => {
      waitForContractDeploy(this.provider, BoomToken, transaction.hash)
        .then((identityContract) => {
          this.identityAddress = identityContract.address;
          this.tokenContract.transfer(identityContract.address, utils.parseEther('100'));});
    });
    this.addKeySubscription = this.hooks.addListener('added', (key) => {
      this.tokenContract.transfer(this.identityAddress, utils.parseEther('5'));
      this.addKeySubscription.remove();
    });
    this.addKeysSubscription = this.hooks.addListener('keysAdded', (key) => {
      this.tokenContract.transfer(this.identityAddress, utils.parseEther('15'));
      this.addKeysSubscription.remove();
    });
  }
}

export default TokenGrantingRelayer;
