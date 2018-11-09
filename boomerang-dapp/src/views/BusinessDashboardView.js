import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import TextBox from './TextBox';


class BusinessDashboardView extends Component {

  render() {
    return (
      <div className="main-screen">
        <div className="container text-center">
          <h1 className="main-title"> Business Dashboard </h1>
          <p>
            Wallet Balance: {' '}
            <span className="bold">
              {this.props.boomBalance} <em>BOOMS</em>
            </span>{' '}
          </p>
          <p>
            Boomerang Allowance: {' '}
            <span className="bold">
              {this.props.boomAllowance} <em>BOOMS</em>
            </span>{' '}
          </p>
          <hr className="separator" />
          <h1 className="sub-title"> Increase Allowance </h1>
          <label> Allowance Increase: </label>
          <TextBox className="input-text-field" placeholder='0' onChange={(event) => this.props.updateRequestedBoomAllowance(event)} />
          <button
            className="btn main-screen-btn"
            onClick={this.props.addBoomAllowance}
          >
            Increase Allowance
          </button>
          <hr className="separator" />
          <h1 className="sub-title"> Request Business Review </h1>
          <label> Customer Address: </label>
          <TextBox className="input-text-field" placeholder='0x000000...' onChange={(event) => this.props.updateCustomerAddress(event)} />
          <label> BOOM Reward: </label>
          <TextBox className="input-text-field" placeholder='0' onChange={(event) => this.props.updateCustomerBoomReward(event)} />
          <label> XP Reward: </label>
          <TextBox className="input-text-field" placeholder='0' onChange={(event) => this.props.updateCustomerXpReward(event)} />
          <label> Transaction Details: </label>
          <TextBox className="input-text-field" placeholder='0' onChange={(event) => this.props.updateTxDetails(event)} />
          <button
            className="btn main-screen-btn"
            onClick={this.props.requestBusinessReview}
          >
            Request Business Review
          </button>
        </div>
      </div>
    );
  }
}

BusinessDashboardView.propTypes = {
  boomBalance: PropTypes.number,
  boomAllowance: PropTypes.number,
  updateRequestedBoomAllowance: PropTypes.func,
  addBoomAllowance: PropTypes.func,
  updateCustomerAddress: PropTypes.func,
  updateCustomerBoomReward: PropTypes.func,
  updateCustomerXpReward: PropTypes.func,
  requestBusinessReview: PropTypes.func,
  updateTxDetails: PropTypes.func,
  events: PropTypes.array
};

export default BusinessDashboardView;
