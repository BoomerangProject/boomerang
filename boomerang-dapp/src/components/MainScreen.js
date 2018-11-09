import React, {Component} from 'react';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import AccountLink from './AccountLink';
import ProfileLink from './ProfileLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';
import BusinessDashboardView from '../views/BusinessDashboardView';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    const {clickerService, boomerangService, identityService, emitter} = this.props.services;
    this.clickerService = clickerService;
    this.boomerangService = boomerangService;
    this.identityService = identityService;
    this.emitter = emitter;
    this.state = {boomAllowance: 0, boomBalance: 0, requestedBoomAllowance: 0};
  }

  setView(view, options) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view, options);
  }

  async requestBusinessReview() {
    await this.boomerangService.requestBusinessReview(this.state.customerAddress, this.state.customerBoomReward, this.state.customerXpReward, this.state.txDetails);
    this.emitter.emit('showModal', 'profileSave');
  }

  updateRequestedBoomAllowance(event) {
    const requestedBoomAllowance = event.target.value;
    this.setState({requestedBoomAllowance: requestedBoomAllowance});
  }

  updateCustomerAddress(event) {
    const customerAddress = event.target.value;
    this.setState({customerAddress: customerAddress});
  }

  updateCustomerBoomReward(event) {
    const customerBoomReward = event.target.value;
    this.setState({customerBoomReward: customerBoomReward});
  }

  updateCustomerXpReward(event) {
    const customerXpReward = event.target.value;
    this.setState({customerXpReward: customerXpReward});
  }

  updateTxDetails(event) {
    const txDetails = event.target.value;
    this.setState({txDetails: txDetails});
  }

  async addBoomAllowance() {
    await this.boomerangService.addBoomFunds(this.state.requestedBoomAllowance);
    this.emitter.emit('showModal', 'profileSave');
  }

  componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
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
          <ProfileIdentity
            type="identityHeader"
            identityService={this.props.services.identityService}/>
          <RequestsBadge setView={this.setView.bind(this)} services={this.props.services}/>
          <AccountLink setView={this.setView.bind(this)} />
          <ProfileLink setView={this.setView.bind(this)} ensName={this.props.services.identityService.identity.name} />
        </HeaderView>
        <BusinessDashboardView 
          updateRequestedBoomAllowance={this.updateRequestedBoomAllowance.bind(this)} 
          addBoomAllowance={this.addBoomAllowance.bind(this)} 
          boomAllowance={this.state.boomAllowance} 
          boomBalance={this.state.boomBalance} 
          requestBusinessReview={this.requestBusinessReview.bind(this)}
          updateCustomerAddress={this.updateCustomerAddress.bind(this)}
          updateCustomerBoomReward={this.updateCustomerBoomReward.bind(this)}
          updateCustomerXpReward={this.updateCustomerXpReward.bind(this)}
          updateTxDetails={this.updateTxDetails.bind(this)} />
      </div>
    );
  }
}

MainScreen.propTypes = {
  services: PropTypes.object
};

export default MainScreen;
