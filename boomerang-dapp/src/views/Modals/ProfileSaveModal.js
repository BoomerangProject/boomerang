import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ProfileSaveModal extends Component {
  render() {
    return (
      <div className="modal-overlay">
        <div className="modal-body">
          <div className="modal-content">
            <p className="modal-text">
              Your profile is being saved. This will take a while. Check the status bar.
            </p>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => this.props.hideModal()}
              className="modal-btn"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ProfileSaveModal.propTypes = {
  hideModal: PropTypes.func
};

export default ProfileSaveModal;
