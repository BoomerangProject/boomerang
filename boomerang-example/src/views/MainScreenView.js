import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import TextBox from './TextBox';

class MainScreenView extends Component {
  renderEvent(event) {
    return (
      <p className="click-history-item" key={event.key}>
        <span className="date"> {event.pressTime} ago </span>
        <span className="bold user-inline">
          <Blockies seed={event.address.toLowerCase()} size={8} scale={4} />{' '}
          {event.name}
        </span>{' '}
        pressed at {event.score} seconds
      </p>
    );
  }

  render() {
    return (
      <div className="main-screen">
        <div className="container text-center">
          <p>
            You have{' '}
            <span className="bold">
              {this.props.clicksLeft} <em>BOOMS</em>
            </span>{' '}
            left
          </p>

          <p>
            Boomerang Allowance: 
            <span className="bold">
              {this.props.loadedFunds} <em>BOOMS</em>
            </span>{' '}
          </p>
          <button
            className="btn main-screen-btn"
            onClick={this.props.onClickerClick}
          >
            Increase Allowance
          </button>

          <TextBox onChange={(event) => this.props.updateAddress(event)} />
          <button
            className="btn main-screen-btn"
            onClick={this.props.onRequestReviewClick}
          >
            Request Review
          </button>

          <p className="click-cost">
            Costs 1 <em>klik</em>
          </p>
          <p className="last-click-text">
            Last time someone pressed this button was
            <span className="bold"> {this.props.lastClick}</span> ago
          </p>
          <hr className="separator" />
          <div className="click-history">
            {this.props.events.map(this.renderEvent.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}

MainScreenView.propTypes = {
  clicksLeft: PropTypes.number,
  loadedFunds: PropTypes.string,
  lastClick: PropTypes.string,
  updateAddress: PropTypes.func,
  onClickerClick: PropTypes.func,
  onRequestReviewClick: PropTypes.func,
  events: PropTypes.array
};

export default MainScreenView;
