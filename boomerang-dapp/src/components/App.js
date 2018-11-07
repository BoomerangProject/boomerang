import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ContentContainer from './ContentContainer';
import Services from '../services/Services';
import Modals from './Modals';
import AppStart from './AppStart';
import Profile from './Profile';


class App extends Component {
  constructor(props) {
    super(props);
    this.services = new Services();
  }

  componentDidMount() {
    this.services.start();
  }

  componentWillUnmount() {
    this.services.stop();
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={()=><AppStart services={this.services}/>}/>
          <Route path="/profile/:ensName" render={(props)=><Profile {...props} services={this.services}/>}/>
        </div>
      </Router>
    );
  }
}

export default App;
