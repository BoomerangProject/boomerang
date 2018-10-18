pragma solidity ^0.4.24;

/**
 * @title Boomerang Interface
 * @dev Boomerang allows businesses to request user reviews of workers, 
 * @dev and to distribute rewards to workers and users.
 */
interface IBoomerang {

    /// @notice Create a ReviewRequest contract based on inputs (emits ReviewRequested event)
    /// @param _customer The customer's ethereum address
    /// @param _customerBoomReward The Boom Token reward for customer after completing review
    /// @param _customerXpReward The XP reward for customer after completing review
    /// @param _worker The worker's ethereum address
    /// @param _workerBoomReward The Boom Token reward for worker for receiving positive review
    /// @param _workerXpReward The XP reward for worker for receiving positive review
    /// @param _txDetailsIPFS IPFS hash of the transaction details
    /// @return The address of the created ReviewRequest
    function requestReview(
        address _customer, 
        uint _customerBoomReward,
        uint _customerXpReward,
        address _worker,
        uint _workerBoomReward,
        uint _workerXpReward,
        string _txDetailsIPFS
    ) public returns(address);

    /// @notice Complete a review request with review information and modifies user and worker xp mapping
    /// @param _rating The customer's rating of a worker (0: Bad, 1:Neutral, 2:Positive)
    /// @param _reviewIPFS The IPFS hash of the cutomer's typed review
    /// @param _business The address of the business
    /// @param _customer The address of the customer
    /// @param _customerXpReward The XP reward for customer after completing review
    /// @param _worker The worker's ethereum address
    /// @param _workerXpReward The XP reward for worker for receiving positive review
    function completeReview(
        uint _rating,
        string _reviewIPFS,
        address _business, 
        address _customer, 
        uint _customerXpReward,
        address _worker,
        uint _workerXpReward
    ) public; // modifier: Only Review Contract
    
    /// @notice Cancel's a review (emits ReviewCancelled event)
    function cancelReview() public; // modifier: Only Review Contract
    
    // solhint-disable-next-line no-simple-event-func-name
    event ReviewRequested(
        address reviewRequest, 
        address business, 
        address customer, 
        address worker, 
        string txDetailsIPFS
    );
    event ReviewCompleted(
        address reviewRequest, 
        uint customerXpGain, 
        uint workerXpGain, 
        uint rating, 
        string reviewIPFS
    );
    event ReviewCancelled(address reviewRequest);
}