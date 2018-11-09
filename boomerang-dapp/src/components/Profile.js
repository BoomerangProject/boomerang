import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProfileView from '../views/ProfileView';
import { Route, Redirect } from 'react-router-dom';
import Modals from './Modals'
import BackToAppBtn from './BackToAppBtn'
import { Link } from 'react-router-dom';
import HeaderView from '../views/HeaderView';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.ensService = this.props.services.ensService;
    this.boomerangService = this.props.services.boomerangService;
    this.emitter = this.props.services.emitter;
    this.state = {
      ensName: 'loading...'
    };
  }

  async componentDidMount() {
    const ensName = this.props.match.params.ensName.replace(/\+/g, '.');
    const address = await this.ensService.getAddress(ensName);
    const userProfile = await this.boomerangService.getProfile(address);
    if (address) {
      this.setState({ensName: ensName, address: address, username: userProfile.name, location: userProfile.location, description: userProfile.description});
    } else {
      this.setState({ensName: 'Identity does not exist.'});
    }
  }

  editUsername(event) {
    const username = event.target.value;
    this.setState({username: username});
  }

  editDescription(event) {
    const description = event.target.value;
    this.setState({description: description});
  }

  editLocation(event) {
    const location = event.target.value;
    this.setState({location: location});
  }

  async saveProfile() {
    const {username, location, description} = this.state;
    await this.boomerangService.editProfile(username, description, location);
    this.emitter.emit('showModal', 'profileSave');
  }

  setView(view) {
    // Do nothing.
  }

  render() {
    return (
      <div className="account">
        <HeaderView>
          <Link to="/">
            <BackToAppBtn setView={this.setView.bind(this)} />
          </Link>
        </HeaderView>
        <div className="container">
          <ProfileView 
            ensName={this.state.ensName} 
            address={this.state.address} 
            username={this.state.username} 
            editUsername={this.editUsername.bind(this)}
            description={this.state.description} 
            editDescription={this.editDescription.bind(this)}
            location={this.state.location} 
            editLocation={this.editLocation.bind(this)}
            saveProfile={this.saveProfile.bind(this)} />
          </div>
        <Modals emitter={this.props.services.emitter} />
      </div>
    );
  }
}

Profile.propTypes = {
  type: PropTypes.string,
  identityService: PropTypes.object
};

export default Profile;
