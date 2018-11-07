import React, {Component} from 'react';
import MainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import AccountLink from './AccountLink';
import ProfileLink from './ProfileLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    const {clickerService, boomerangService, identityService} = this.props.services;
    this.clickerService = clickerService;
    this.boomerangService = boomerangService;
    this.identityService = identityService;
    this.state = {lastClick: '0', lastPresser: 'nobody', events: []};
  }

  setView(view, options) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view, options);
  }

  async onClickerClick() {
    const {emitter} = this.props.services;
    //await this.boomerangService.editProfile('Kyle B!', 'Just the coolest blockchain architect like ever', 'Boston Baby!');
    //emitter.emit('setView', 'Profile', {ensName: this.identityService.identity.name})
  }

  componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  async update() {

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
        <MainScreenView clicksLeft={this.state.clicksLeft} events={this.state.events} onClickerClick={this.onClickerClick.bind(this)} lastClick={this.state.lastClick} />
      </div>
    );
  }
}

MainScreen.propTypes = {
  services: PropTypes.object
};

export default MainScreen;
