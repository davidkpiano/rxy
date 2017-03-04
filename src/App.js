import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';

import Launchpad from './components/Launchpad';
import Score from './components/Score';

const sampleNoteGroups = [
    [{ pitch: 'C4', duration: 1}],
    [{ pitch: 'D4', duration: 1}, { pitch: 'F4', duration: 5}],
    [{ pitch: 'E4', duration: 1}],
    [{ pitch: 'F4', duration: 1}],
    [{ pitch: 'G4', duration: 1}],
]

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentBeat: -1,
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({ currentBeat: this.state.currentBeat + 1 });
    }, 1000)
  }
  render() {
    return (
      <div className="ui-app">
        <Score currentBeat={this.state.currentBeat} noteGroups={sampleNoteGroups} />
        <Launchpad rows={8} />
      </div>
    );
  }
}

export default App;
