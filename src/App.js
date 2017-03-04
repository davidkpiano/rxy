import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';

import Launchpad from './components/Launchpad';

class App extends Component {
  render() {
    return (
      <div className="ui-app">
        <Launchpad rows={8} />
      </div>
    );
  }
}

export default App;
