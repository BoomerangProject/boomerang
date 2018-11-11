import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom'
import Login from './Login';
import CreatingId from './CreatingId';
import ApproveConnection from './ApproveConnection';
import Greeting from './Greeting';
import Account from './Account';
import CustomerDashboard from './CustomerDashboard';
import BusinessDashboard from './BusinessDashboard';
import PendingRequests from './PendingRequests';
import Backup from './Backup';
import RecoverAccount from './RecoverAccount';
import PropTypes from 'prop-types';

class ContentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Login',
      viewParameters: {}
    };
  }

  componentDidMount() {
    const {emitter} = this.props.services;
    this.subscription = emitter.addListener('setView', this.setView.bind(this));
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  setView(view, viewParameters = {}) {
    this.setState({view, viewParameters});
    window.scrollTo(0, 0);
  }

  render() {
    const {services} = this.props;
    if (this.state.view === 'Login') {
      return <Login services={services} />;
    } else if (this.state.view === 'CreatingID') {
      return <CreatingId identityService={this.props.services.identityService}/>;
    } else if (this.state.view === 'Greeting') {
      return <Greeting
        identityService={services.identityService}
        greetingService={services.greetingService}
        viewParameters={this.state.viewParameters} />;
    } else if (this.state.view === 'MainScreen' || this.state.view === 'Customer') {
      return <CustomerDashboard services={services}/>;
    } else if (this.state.view === 'Business') {
      return <BusinessDashboard services={services}/>;
    } else if (this.state.view === 'Account') {
      return (<Account identityService={services.identityService}/>);
    } else if (this.state.view === 'ApproveConnection') {
      return <ApproveConnection services={services}/>;
    } else if (this.state.view === 'PendingRequests') {
      return <PendingRequests services = {services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Backup') {
      return <Backup services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'RecoverAccount') {
      return <RecoverAccount services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Profile') {
      const ensName = this.state.viewParameters.ensName.replace(/\./g, '+');
      return <Redirect to={"/profile/" + ensName} />;
    }
  }
}

ContentContainer.propTypes = {
  services: PropTypes.object
};

export default ContentContainer;
