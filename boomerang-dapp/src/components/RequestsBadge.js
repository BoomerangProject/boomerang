import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NativeNotificationService from '../services/NativeNotificationService';

class RequestsBadge extends Component {
  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.authorisationService = this.props.services.authorisationService;
    this.boomerangService = this.props.services.boomerangService;
    this.state = {
      requests: this.authorisationService.pendingAuthorisations.length
    };
    this.nativeNotificationService = new NativeNotificationService();
  }

  componentDidMount() {
    const {address} = this.identityService.identity;
    this.subscription = this.authorisationService.subscribe(
      address,
      this.onAuthorisationChanged.bind(this)
    );
    this.subscription = this.boomerangService.subscribe(
      'ReviewRequested',
      this.onReviewRequested.bind(this)
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  onReviewRequested(reviewRequest) {
    if (reviewRequest.customer === this.identityService.identity.address) {
      if (this.boomerangService.isActiveReview(reviewRequest.reviewId)) {
        console.log(this.state.requests);
        this.setState({requests: this.state.requests + 1});
      }
    }
  }

  onAuthorisationChanged(authorisations) {
    this.setState({requests: this.state.requests + authorisations.length});
    if (authorisations.length > 0) {
      this.nativeNotificationService.notifyLoginRequest(authorisations[0].label);
    }
  }

  render() {
    return this.state.requests > 0 ? (
      <button
        onClick={() => this.props.setView('PendingAuthorizations')}
        className="request-notification"
      >
        {this.state.requests}
      </button>
    ) : (
      ''
    );
  }
}

RequestsBadge.propTypes = {
  setView: PropTypes.func,
  services: PropTypes.object
};

export default RequestsBadge;
