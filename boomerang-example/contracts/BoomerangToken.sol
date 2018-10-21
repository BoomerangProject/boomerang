pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/**
 * @title Boomerang Token
 * @author Ben Johnson & Kyle Bryant
 *
 * @dev ERC20 Boomerang Token (BOOM)
 *
 * Boomerang tokens are displayed using 18 decimal places of precision.
 *
 * The base units of Boomerang tokens are referred to as "kutoas".
 *
 * In Swahili, kutoa means "to give".
 * In Finnish, kutoa means "to weave" or "to knit".
 *
 * 1 BOOM is equivalent to:
 *
 *    1,000,000,000,000,000,000 == 1 * 10**18 == 1e18 == One Quintillion kutoas
 *
 *
 * All initial BOOM kutoas are assigned to the creator of this contract.
 *
 */
contract BoomerangToken is StandardToken {
    string public constant name = "Boomerang";
    string public constant symbol = "BOOM";
    uint8 public constant decimals = 18;

    uint256 public constant MAX_SUPPLY = 10 * (10**9) * (10 ** uint256(decimals));
    constructor() public {
        totalSupply_ = MAX_SUPPLY;
        balances[msg.sender] = MAX_SUPPLY;
        Transfer(0x0, msg.sender, MAX_SUPPLY);
    }
}