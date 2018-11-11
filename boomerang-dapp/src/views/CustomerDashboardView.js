import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import TextBox from './TextBox';
import PendingReviewRequestsView from './PendingReviewRequestsView';

class CustomerDashboardView extends Component {

  render() {
    const reviewRequests = this.props.reviewRequests.map((reviewRequest) => (
      <PendingReviewRequestsView
        onStartReviewClick={this.props.onStartReviewClick}
        reviewRequest={reviewRequest}
      />));
    return (
      <div className="main-screen">
        <div className="container text-center">
          <h1 className="main-title"> Customer Dashboard </h1>
          <p>
            Wallet Balance: {' '}
            <span className="bold">
              {this.props.boomBalance} <em>BOOM</em>
            </span>{' '}
          </p>
          <hr className="separator" />
          <h1 className="sub-title"> Pending Reviews </h1>
          {reviewRequests}
          <hr className="separator" />
        </div>
      </div>
    );
  }
}

CustomerDashboardView.propTypes = {
  boomBalance: PropTypes.number,
  events: PropTypes.array,
  reviewRequests: PropTypes.array
};

export default CustomerDashboardView;
