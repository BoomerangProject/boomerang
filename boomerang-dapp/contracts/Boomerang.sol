pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./interfaces/IBoomerang.sol";
import "./BoomerangToken.sol";

contract Boomerang is IBoomerang{
    using SafeMath for uint;

    BoomerangToken public boomToken;
    
    uint public numReviews = 0;
    mapping(uint => bool) public isActiveReview;
    mapping(uint => uint) public reviewTimeCreated;
    
    // ReviewID -> Business address
    
    mapping(uint => address) public reviewBusiness;
    
    // ReviewID -> Customer Details
    
    mapping(uint => address) public reviewCustomer;
    
    mapping(uint => uint) public reviewCustomerBoomReward;
    
    mapping(uint => uint) public reviewCustomerXpReward;
    
    // ReviewID -> Worker Details
    
    mapping(uint => address) public reviewWorker;
    
    mapping(uint => uint) public reviewWorkerBoomReward;
    
    mapping(uint => uint) public reviewWorkerXpReward;
    
    // Mappings that store total xp earned by
    // customers and workers for a specific business
    
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
        string _txDetailsHash
    ) 
        public 
    {
        require(msg.sender != _customer, "Message sender cannot be customer.");
        require(_worker != _customer, "Worker cannot be customer.");
        
        reviewTimeCreated[numReviews] = block.timestamp;
        isActiveReview[numReviews] = true;
        
        reviewBusiness[numReviews] = msg.sender;
    
        reviewCustomer[numReviews] = _customer;
        reviewCustomerBoomReward[numReviews] = _customerBoomReward;
        reviewCustomerXpReward[numReviews] = _customerXpReward;
        
        reviewWorker[numReviews] = _worker;
        reviewWorkerBoomReward[numReviews] = _workerBoomReward;
        reviewWorkerXpReward[numReviews] = _workerXpReward;
        
        uint totalReward = _customerBoomReward.add(_workerBoomReward);
        require(
            boomToken.transferFrom(msg.sender, this, totalReward), 
            "Not enough Boomerang tokens to request a review."
        );
        
        emit ReviewRequested(
            numReviews, msg.sender, _customer, _worker, _txDetailsHash
        );
        numReviews = numReviews.add(1);
    }
    
    function completeReview(
        uint _reviewId,
        uint _rating,
        string _reviewHash
    ) 
        public 
    {
        require(
            msg.sender == reviewCustomer[_reviewId], 
            "Message sender must be customer of reviewId."
        );
        require(
            _rating >= 0 && _rating <= 2,
            "Rating must be int from 0 to 2."
        );
        require(
            isActiveReview[_reviewId],
            "ReviewId must be an active review."
        );
        
        if (_rating == 2) {
            boomToken.transfer(
                reviewWorker[_reviewId], 
                reviewWorkerBoomReward[_reviewId]
            );
            businessWorkerXp[reviewBusiness[_reviewId]][reviewWorker[_reviewId]] = 
            businessWorkerXp[reviewBusiness[_reviewId]][reviewWorker[_reviewId]]
            .add(reviewWorkerXpReward[_reviewId]);
        } else {
            boomToken.transfer(
                reviewBusiness[_reviewId], 
                reviewWorkerBoomReward[_reviewId]
            );
        }
        boomToken.transfer(
            reviewCustomer[_reviewId],
            reviewCustomerBoomReward[_reviewId]
        );
        businessCustomerXp[reviewBusiness[_reviewId]][reviewCustomer[_reviewId]] = 
        businessCustomerXp[reviewBusiness[_reviewId]][reviewCustomer[_reviewId]]
        .add(reviewCustomerXpReward[_reviewId]);
        
        isActiveReview[_reviewId] = false;
        
        emit ReviewCompleted(
            _reviewId, reviewBusiness[_reviewId], msg.sender, reviewWorker[_reviewId], _rating, _reviewHash
        );
    }
    
    function cancelReview(uint _reviewId) public {
        require(
            msg.sender == reviewBusiness[_reviewId], 
            "Only business can cancel a review."
        );
        require(
            isActiveReview[_reviewId], 
            "Only active reviews can be cancelled."
        );
        require(
            now >= reviewTimeCreated[_reviewId] + 1 weeks,
            "At least 1 week needs to pass before you can cancel a review."
        );
        
        uint totalReward = reviewCustomerBoomReward[_reviewId]
        .add(reviewWorkerBoomReward[_reviewId]);
        
        boomToken.transfer(
            reviewCustomer[_reviewId],
            totalReward
        );
        
        isActiveReview[_reviewId] = false;
        emit ReviewCancelled(_reviewId);
    }

    function reviseReview(uint _reviewId, uint _rating, string _reviewHash) public {
        require(
            msg.sender == reviewCustomer[_reviewId],
            "You must be the writer of this review in order to revise"
        );
        emit ReviewRevised(_reviewId, _rating, _reviewHash);
    }

    function likeReview(uint _reviewId) public {
        require(
            businessCustomerXp[reviewBusiness[_reviewId]][msg.sender] > 0,
            "You must have xp with this business in order to like this review."
        );
        emit ReviewLiked(_reviewId, msg.sender);
    }
    
    function editProfile(string _profileHash) public {
        emit ProfileEdited(msg.sender, _profileHash);
    }
}