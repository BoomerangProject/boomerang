import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import BoomerangToken from '../build/BoomerangToken';

chai.use(solidity);

const {expect} = chai;

describe('Boomerang Token', async () => {

  const tokenUnit = 10 ** 18;
  const oneBillion = 10 ** 9;
  const maxTokens = 10 * oneBillion * tokenUnit;

  let provider;
  let token;
  let wallet;
  let walletTo;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, walletTo] = await getWallets(provider);
    token = await deployContract(wallet, BoomerangToken);
  });

  it('Assigns 10 Billion BOOM to creator', async () => {
    let assignedTokens = Number(await token.balanceOf(wallet.address));
    expect(assignedTokens).to.eq(maxTokens);
  });

})