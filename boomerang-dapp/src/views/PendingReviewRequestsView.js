import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PendingReviewRequestsView extends Component {
  render() {
    return (
      <div>
        <br />
        <p
          className="pending-authorizations-text"
          key={this.props.reviewRequest.reviewId}
        >
          New review request from {' '}
          <span className="bold">{this.props.reviewRequest.businessName}</span>
          , reviewing {' '}
          <span className="bold">{this.props.reviewRequest.workerName}</span>,
          about transaction {' '}
          <span className="bold">{this.props.reviewRequest.txDetails}</span>
          {' '}
          Reward: <span className="bold">{this.props.reviewRequest.boomReward} BOOM</span>
          ,{' '}
          <span className="bold">{this.props.reviewRequest.xpReward} XP</span>
        </p>
        <button
          className="btn-alt fullwidth"
          onClick={() => this.props.onStartReviewClick(this.props.reviewRequest.reviewId)}
        >
          Start Review <br />
        </button>
      </div>
    );
  }
}

PendingReviewRequestsView.propTypes = {
  reviewRequest: PropTypes.object,
  onStartReviewClick: PropTypes.func,
};

export default PendingReviewRequestsView;
