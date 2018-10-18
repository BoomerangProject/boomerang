pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./interfaces/IBoomerang.sol";
import "./BoomerangToken.sol";
import "./ReviewRequest.sol";

contract Boomerang is IBoomerang{
    using SafeMath for uint;

    BoomerangToken public boomToken;
    
    mapping(address => bool) public reviewContracts;
    
    mapping(address => mapping(address => uint)) public businessCustomerXp;
    
    mapping(address => mapping(address => uint)) public businessWorkerXp;
    
    constructor (BoomerangToken _boomToken) public {
        boomToken = _boomToken;
    }
    
    function requestReview(
        address _customer, 
        uint _customerBoomReward,
        uint _customerXpReward,
        address _worker,
        uint _workerBoomReward,
        uint _workerXpReward,
        string _txDetailsIPFS
    ) 
        public 
        returns(address)
    {
        require(msg.sender != _customer, "Message sender cannot be customer.");
        uint totalReward = _customerBoomReward.add(_workerBoomReward);
        ReviewRequest reviewRequest = new ReviewRequest(
            this, 
            boomToken, 
            msg.sender, 
            _customer, 
            _customerBoomReward,
            _customerXpReward, 
            _worker, 
            _workerBoomReward, 
            _workerXpReward
        );
        reviewContracts[reviewRequest] = true;
        require(
            boomToken.transferFrom(msg.sender, reviewRequest, totalReward), 
            "Not enough Boomerang tokens to request a review."
        );
        emit ReviewRequested(
            reviewRequest, msg.sender, _customer, _worker, _txDetailsIPFS
        );
        return reviewRequest;
    }
    
    function completeReview(
        uint _rating,
        string _reviewIPFS,
        address _business, 
        address _customer, 
        uint _customerXpReward,
        address _worker,
        uint _workerXpReward
    ) 
        public 
        onlyReviewContract
    {
        businessCustomerXp[_business][_customer] = 
        businessCustomerXp[_business][_customer].add(_customerXpReward);
        
        businessWorkerXp[_business][_worker] = 
        businessWorkerXp[_business][_worker].add(_workerXpReward);
        
        emit ReviewCompleted(
            msg.sender, _customerXpReward, _workerXpReward, _rating, _reviewIPFS
        );
    }
    
    function cancelReview() public onlyReviewContract {
        emit ReviewCancelled(msg.sender);
    }
    
    modifier onlyReviewContract() {
        require(
            reviewContracts[msg.sender],
            "Sender not a ReviewRequest contract."
        );
        _;
    }
}