import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PendingAuthorisationView from './PendingAuthorisationView';
import PendingReviewRequestsView from './PendingReviewRequestsView';

class PendingRequestsView extends Component {
  render() {
    if (this.props.authorisations.length + this.props.reviewRequests.length === 0) {
      return (
        <div className="pending-authorizations">
          <em>There are no pending requests at the moment</em>
        </div>
      );
    }
    const authorisations = this.props.authorisations.map((authorisation) => (
      <PendingAuthorisationView
        key={`${authorisation.key}_${authorisation.label.time}`}
        authorisation={authorisation}
        onAcceptClick={this.props.onAcceptClick}
        onDenyClick={this.props.onDenyClick}
      />));

    console.log(this.props.reviewRequests);
    const reviewRequests = this.props.reviewRequests.map((reviewRequest) => (
      <PendingReviewRequestsView
        onStartReviewClick={this.props.onStartReviewClick}
        reviewRequest={reviewRequest}
      />));

    return (
      <div className="pending-authorizations">
        <h1 className="main-title">Pending Requests</h1>
        <div className="container">
          <div className="container">
            {authorisations}
            {reviewRequests}
          </div>
        </div>
      </div>
    );
  }
}

PendingRequestsView.propTypes = {
  reviewRequests: PropTypes.array,
  authorisations: PropTypes.array,
  onAcceptClick: PropTypes.func,
  onDenyClick: PropTypes.func,
  onStartReviewClick: PropTypes.func
};

export default PendingRequestsView;
