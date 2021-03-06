import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import BoomerangToken from '../build/BoomerangToken';
import Boomerang from '../build/Boomerang';

chai.use(solidity);

const {expect} = chai;

const filterLogsWithTopics = (logs, topics) =>
  logs.filter((log) => arrayIntersection(topics, log.topics).length > 0);

const arrayIntersection = (array1, array2) =>
  array1.filter((element) => array2.includes(element));

describe('Boomerang', async () => {

  const tokenUnit = 10 ** 18;
  const oneBillion = 10 ** 9;
  const maxTokens = 10 * oneBillion * tokenUnit;

  let provider;
  let boomerang;
  let boomerangToken;
  let boomerangWallet;
  let businessWallet;
  let customerWallet;
  let workerWallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [boomerangWallet, businessWallet, customerWallet, workerWallet] = await getWallets(provider);
    boomerangToken = await deployContract(boomerangWallet, BoomerangToken);
    boomerang = await deployContract(boomerangWallet, Boomerang, [boomerangToken.address]);
    await boomerangToken.approve(boomerang.address, 10000);
  });

  it('Fails to request a review of worker who is not part of business', async () => {
    await expect(    
      boomerang.requestWorkerReview(
        customerWallet.address, 
        10,
        10,
        workerWallet.address,
        10,
        10,
        'Skedaddle Trip'
      )
    )
    .to.be.revertedWith('Worker is not part of business.');
  });

  it('Transfers BOOM reward from caller to ReviewRequest contract', async () => {
    await expect(    
      boomerang.requestBusinessReview(
        customerWallet.address, 
        10,
        10,
        'Skedaddle Trip'
      )
    )
    .to.emit(boomerang, 'ReviewRequested');
    let numTokens = Number(await boomerangToken.balanceOf(boomerangWallet.address));
    expect(numTokens).to.eq(maxTokens - 20);
  });

  it('Does not allow review requester (business) to be customer', async () => {
    await expect(    
      boomerang.requestBusinessReview(
        boomerangWallet.address, 
        10,
        10,
        'Skedaddle Trip'
      )
    )
    .to.be.revertedWith('Message sender cannot be customer.');
  });

  // TODO: Add worker to business, then request worker review
  // it('Does not allow customer to be worker', async () => {
  //   await expect(    
  //     boomerang.requestReview(
  //       workerWallet.address, 
  //       10,
  //       10,
  //       workerWallet.address,
  //       10,
  //       10,
  //       'Skedaddle Trip'
  //     )
  //   )
  //   .to.be.revertedWith('Worker cannot be customer.');
  // });

  it('Allows anyone to edit their profile', async () => {
    await expect(    
      boomerang.editProfile('myProfileHash')
    )
    .to.emit(boomerang, 'ProfileEdited')
    .withArgs(boomerangWallet.address, 'myProfileHash');
  });

  it('Does not allow review requester to exceed BOOM allowance', async () => {
    await expect(    
      boomerang.requestBusinessReview(
        customerWallet.address, 
        100000,
        10,
        'Skedaddle Trip'
      )
    )
    .to.be.reverted;
  });

})