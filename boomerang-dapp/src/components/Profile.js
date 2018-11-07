import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProfileView from '../views/ProfileView'

class Profile extends Component {

  constructor(props) {
    super(props);
    this.ensService = this.props.services.ensService;
    this.boomerangService = this.props.services.boomerangService;
    this.state = {
      ensName: 'loading...'
    };
  }

  async editProfile() {
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

  render() {
    return (
      <div>
        <ProfileView 
          ensName={this.state.ensName} 
          address={this.state.address} 
          username={this.state.username} 
          description={this.state.description} 
          location={this.state.location} 
          editProfile={this.editProfile.bind(this)} />
      </div>
    );
  }
}

Profile.propTypes = {
  type: PropTypes.string,
  identityService: PropTypes.object
};

export default Profile;
