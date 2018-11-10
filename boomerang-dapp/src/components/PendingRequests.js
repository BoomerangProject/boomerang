import React, {Component} from 'react';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import BackBtn from './BackBtn';
import PendingRequestsView from '../views/PendingRequestsView';
import PropTypes from 'prop-types';
import ProfileIdentity from './ProfileIdentity';
import {tokenContractAddress} from '../../config/config';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class PendingRequests extends Component {
  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.boomerangService = this.props.services.boomerangService;
    this.sdk = this.props.services.sdk;
    this.authorisationService = this.props.services.authorisationService;
    this.state = {
      authorisations: this.authorisationService.pendingAuthorisations,
      reviewRequests: []
    };
  }

  async componentDidMount() {
    const pendingReviewRequests = await this.boomerangService.getPendingReviewRequests();
    const {address} = this.identityService.identity;
    this.setState({
      authorisations: this.authorisationService.pendingAuthorisations,
      reviewRequests: pendingReviewRequests
    });
    this.subscription = this.authorisationService.subscribe(
      address,
      this.onAuthorisationChanged.bind(this)
    );
    
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  onAuthorisationChanged(authorisations) {
    const {emitter} = this.props.services;

    this.setState({authorisations});

    if (authorisations.length === 0) {
      emitter.emit('setView', 'MainScreen');
    }
  }

  async onAcceptClick(publicKey) {
    const {identityService} = this.props.services;
    const to = identityService.identity.address;
    const {privateKey} = identityService.identity;
    const {sdk} = identityService;
    const addKeyPaymentOptions = {
      ...DEFAULT_PAYMENT_OPTIONS,
      gasToken: tokenContractAddress
    };
    await sdk.addKey(to, publicKey, privateKey, addKeyPaymentOptions);
  }

  async onDenyClick(publicKey) {
    const {identityService} = this.props.services;
    const identityAddress = identityService.identity.address;
    const {sdk} = identityService;
    await sdk.denyRequest(identityAddress, publicKey);
  }

  async onStartReviewClick(reviewId) {

  }

  render() {
    return (
      <div>
        <HeaderView>
          <ProfileIdentity
            type="identityHeader"
            identityService={this.props.services.identityService}
          />
          <RequestsBadge
            setView={this.props.setView}
            services={this.props.services}
          />
          <BackBtn setView={this.props.setView} />
        </HeaderView>
        <PendingRequestsView
          setView={this.props.setView}
          reviewRequests={this.state.reviewRequests}
          authorisations={this.state.authorisations}
          onAcceptClick={this.onAcceptClick.bind(this)}
          onDenyClick={this.onDenyClick.bind(this)}
          onStartReviewClick={this.onStartReviewClick.bind(this)}
        />
      </div>
    );
  }
}

PendingRequests.propTypes = {
  setView: PropTypes.func,
  services: PropTypes.object
};

export default PendingRequests;
