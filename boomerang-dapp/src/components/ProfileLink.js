import React from 'react';
import PropTypes from 'prop-types';

const ProfileLink = (props) => (
  <button onClick={() => props.setView('Profile', {ensName: props.ensName})} className="btn header-btn">
    Profile
  </button>
);

ProfileLink.propTypes = {
  setView: PropTypes.func,
  ensName: PropTypes.string
};

export default ProfileLink;
