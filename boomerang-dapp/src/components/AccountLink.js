import React from 'react';
import PropTypes from 'prop-types';

const AccountLink = (props) => (
  <button onClick={() => props.setView('Account')} className="btn header-btn">
    Settings
  </button>
);

AccountLink.propTypes = {
  setView: PropTypes.func
};

export default AccountLink;
