import React, {Component} from 'react';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import AccountLink from './AccountLink';
import ProfileLink from './ProfileLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';
import DropDown from './DropDown';
import CustomerDashboardView from '../views/CustomerDashboardView';

class CustomerDashboard extends Component {
  constructor(props) {
    super(props);
    const {clickerService, boomerangService, identityService, emitter} = this.props.services;
    this.clickerService = clickerService;
    this.boomerangService = boomerangService;
    this.identityService = identityService;
    this.emitter = emitter;
    this.state = {boomBalance: 0, reviewRequests: []};
  }

  setView(view, options) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view, options);
  }

  async requestBusinessReview() {
    await this.boomerangService.requestBusinessReview(this.state.customerAddress, this.state.customerBoomReward, this.state.customerXpReward, this.state.txDetails);
    this.emitter.emit('showModal', 'profileSave');
  }

  async componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
    const pendingReviewRequests = await this.boomerangService.getPendingReviewRequests();
    this.setState({
      reviewRequests: pendingReviewRequests
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  returnValue(value) {
    this.setView(value);
  }

  async update() {
    const balance = await this.boomerangService.getBoomBalance();
    const boomBalance = parseInt(balance, 10);
    this.setState({boomBalance: boomBalance});

    const allowance = await this.boomerangService.getBoomFunds();
    const boomAllowance = parseInt(allowance, 10);
    this.setState({boomAllowance: boomAllowance});

    setTimeout(this.update.bind(this), 1000);
  }

  render() {
    return (
      <div>
        <HeaderView>
          <DropDown title='Customer' returnValue={this.returnValue.bind(this)}/>
          <RequestsBadge setView={this.setView.bind(this)} services={this.props.services}/>
          <AccountLink setView={this.setView.bind(this)} />
          <ProfileLink setView={this.setView.bind(this)} ensName={this.props.services.identityService.identity.name} />
        </HeaderView>
        <CustomerDashboardView 
          boomBalance={this.state.boomBalance}
          reviewRequests={this.state.reviewRequests} />
      </div>
    );
  }
}

CustomerDashboard.propTypes = {
  services: PropTypes.object
};

export default CustomerDashboard;
