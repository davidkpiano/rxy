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
      currentTime: Date.now(),
      bpm: 120,
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        currentBeat: (this.state.currentBeat + 1) % 8,
        currentTime: Date.now(),
      });
    }, this.state.bpm)
  }
  render() {
    return (
      <div className="ui-app">
        <Score
          currentBeat={this.state.currentBeat}
          currentTime={this.state.currentTime}
          playing={true}
          bpm={this.state.bpm}
        />
        <Launchpad rows={8} />
      </div>
    );
  }
}

export default App;
