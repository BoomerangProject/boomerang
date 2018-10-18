import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import BoomerangToken from '../build/BoomerangToken';
import Boomerang from '../build/Boomerang';

chai.use(solidity);

const {expect} = chai;

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

  it('Requests review from user of worker', async () => {
  await expect(    
    boomerang.requestReview(
      customerWallet.address, 
      10,
      10,
      workerWallet.address,
      10,
      10,
      'Skedaddle Trip'
    )
  )
  .to.emit(boomerang, 'ReviewRequested');
  });

})