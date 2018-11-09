pragma solidity ^0.4.24;

/**
 * @title Boomerang Interface
 * @dev Boomerang allows businesses to request user reviews of workers, 
 * @dev and to distribute rewards to workers and users.
 */
interface IBoomerang {

    /// @notice Request a review from a customer about a worker (emits ReviewRequested event)
    /// @param _customer The customer's ethereum address
    /// @param _customerBoomReward The Boom Token reward for customer after completing review
    /// @param _customerXpReward The XP reward for customer after completing review
    /// @param _worker The worker's ethereum address
    /// @param _workerBoomReward The Boom Token reward for worker for receiving positive review
    /// @param _workerXpReward The XP reward for worker for receiving positive review
    /// @param _txDetailsHash IPFS hash of the transaction details
    function requestWorkerReview(
        address _customer, 
        uint _customerBoomReward,
        uint _customerXpReward,
        address _worker,
        uint _workerBoomReward,
        uint _workerXpReward,
        string _txDetailsHash
    ) public;

    /// @notice Complete a review request with review information and modifies user and worker xp mapping (emits ReviewCompleted event)
    /// @param _reviewId The review ID of the review being completed.
    /// @param _rating The customer's rating of a worker (0: Bad, 1:Neutral, 2:Positive)
    /// @param _reviewHash The hash of the cutomer's typed review
    function completeReview(
        uint _reviewId,
        uint _rating,
        string _reviewHash
    ) public;
    
    /// @notice Cancel's a review (emits ReviewCancelled event)
    /// @param _reviewId The review ID of the review being cancelled.
    function cancelReview(uint _reviewId) public;
    
    /// @notice Revise a review (emits ReviewRevised event)
    /// @param _reviewId The review ID of the review being revised.
    /// @param _rating The revised rating.
    /// @param _reviewHash the revised hash of the customers typed review.
    function reviseReview(uint _reviewId, uint _rating, string _reviewHash) public;
    
    /// @notice Like a review (emits ReviewLiked event)
    /// @param _reviewId The review ID of the review being liked.
    function likeReview(uint _reviewId) public;
    
    /// @notice Edits user's Boomerang profile (emits ProfileEdited event)
    /// @param _profileHash The hash of the profile edit.
    function editProfile(string _profileHash) public;
    
    // solhint-disable-next-line no-simple-event-func-name
    event ReviewRequested(
        uint reviewId, 
        address business, 
        address customer,
        address worker, 
        string txDetailsHash
    );
    event ReviewCompleted(
        uint reviewId, 
        address business, 
        address customer,
        address worker, 
        uint rating,
        string reviewHash
    );
    event ReviewCancelled(uint reviewId);
    event ReviewRevised(uint reviewId, uint rating, string reviewHash);
    event ReviewLiked(uint reviewId, address customer);
    event ProfileEdited(address user, string profileHash);
    event AddWorkerRequested(address business, address worker);
    event AddWorkerConfirmed(address business, address worker);
    event WorkerRemoved(address _business, address _worker);
}