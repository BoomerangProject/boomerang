import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProfileView from '../views/ProfileView';
import { Route, Redirect } from 'react-router-dom';


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
  }

  render() {
    return (
      <div>
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
    );
  }
}

Profile.propTypes = {
  type: PropTypes.string,
  identityService: PropTypes.object
};

export default Profile;
