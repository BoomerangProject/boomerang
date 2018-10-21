pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./BoomerangToken.sol";
import "./Boomerang.sol";

contract ReviewRequest {
    using SafeMath for uint;
    
    uint public timeCreated;
    
    Boomerang public boomerang;
    
    BoomerangToken public boomToken;
    
    address public business;
    
    address public customer;
    
    uint public customerBoomReward;
    
    uint public customerXpReward;
    
    address public worker;
    
    uint public workerBoomReward;
    
    uint public workerXpReward;
    
    constructor(
        Boomerang _boomerang,
        BoomerangToken _boomToken,
        address _business, 
        address _customer, 
        uint _customerBoomReward,
        uint _customerXpReward,
        address _worker,
        uint _workerBoomReward,
        uint _workerXpReward
    ) 
        public 
    {
        timeCreated = block.timestamp;
        boomerang = _boomerang;
        boomToken = _boomToken;
        business = _business;
        customer = _customer;
        customerBoomReward = _customerBoomReward;
        customerXpReward = _customerXpReward;
        worker = _worker;
        workerBoomReward = _workerBoomReward;
        workerXpReward = _workerXpReward;
    }
    
    function submitReview(uint _rating, string _reviewIPFS) public {
        require(msg.sender == customer);
        require(_rating >= 0 && _rating <= 2);
        uint workerXpReceived = 0;
        if (_rating == 2) {
            boomToken.transfer(worker, workerBoomReward);
            workerXpReceived = workerXpReward;
        } else {
            boomToken.transfer(business, workerBoomReward);
        }
        boomToken.transfer(customer, customerBoomReward);
        boomerang.completeReview(
            _rating,
            _reviewIPFS, 
            business, 
            customer, 
            customerXpReward, 
            worker, 
            workerXpReceived
        );
        selfdestruct(this);
    }
    
    function cancelReview() public {
        require(msg.sender == business);
        require(now >= timeCreated + 1 weeks);
        uint totalReward = customerBoomReward.add(workerBoomReward);
        boomToken.transfer(business, totalReward);
        boomerang.cancelReview();
        selfdestruct(this);
    }
}