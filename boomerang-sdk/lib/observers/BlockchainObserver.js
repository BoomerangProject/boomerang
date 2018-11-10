import {utils, Interface} from 'ethers';
import ObserverBase from './ObserverBase';
import Boomerang from 'Boomerang-contracts/build/Boomerang';

class BlockchainObserver extends ObserverBase {
  constructor(provider) {
    super();
    this.provider = provider;
    this.eventInterface = new Interface(Boomerang.interface).events;
    this.codec = new utils.AbiCoder();
  }

  async start() {
    this.lastBlock = await this.provider.getBlockNumber();
    await super.start();
  }

  async tick() {
    for (const identityAddress of Object.keys(this.emitters)) {
      await this.fetchEvents(identityAddress);
    }
  }

  async fetchEvents(boomerangAddress) {
    await this.fetchEventsOfType('ReviewRequested', boomerangAddress);
    await this.fetchEventsOfType('ReviewCompleted', boomerangAddress);
    await this.fetchEventsOfType('AddWorkerRequested', boomerangAddress);
    await this.fetchEventsOfType('AddWorkerConfirmed', boomerangAddress);
    await this.fetchEventsOfType('WorkerRemoved', boomerangAddress);
  }

  async fetchEventsOfType(type, boomerangAddress) {
    const topics = [this.eventInterface[type].topics];
    const filter = {fromBlock: this.lastBlock, address: boomerangAddress, topics};
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      this.emitters[boomerangAddress].emit(type, this.parseArgs(type, event));
    }
    this.lastBlock = await this.provider.getBlockNumber();
  }

  parseArgs(type, event) {
    if (event.topics[0] === this.eventInterface[type].topics[0]) {
      const args = this.eventInterface[type].parse(event.topics, event.data);
      if (type === 'ReviewRequested') {
        const reviewId = args.reviewId.toNumber();
        const customer = args.customer;
        const business = args.business;
        const worker = args.worker;
        return {reviewId, customer, business, worker};
      }
    }
    throw `Not supported event with topic: ${event.topics[0]}`;
  }
}

export default BlockchainObserver;
