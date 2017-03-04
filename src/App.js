import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';

import Launchpad from './components/Launchpad';
import Score from './components/Score';
import Keyboard from './components/Keyboard';

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentBeat: -1,
      bpm: 120,
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({ currentBeat: (this.state.currentBeat + 1) % 8 });
    }, this.state.bpm)
  }
  render() {
    return (
      <div className="ui-app">
        <Keyboard />
        <Score currentBeat={this.state.currentBeat} bpm={this.state.bpm} />
        <Launchpad rows={8} />
      </div>
    );
  }
}

export default App;
