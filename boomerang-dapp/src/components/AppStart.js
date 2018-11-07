import React, {Component} from 'react';
import ContentContainer from './ContentContainer';
import Modals from './Modals';

class AppStart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ContentContainer services={this.props.services} />
        <Modals emitter={this.props.services.emitter} />
      </div>
    );
  }
}

export default AppStart;