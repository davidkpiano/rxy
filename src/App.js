import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';
import i from 'icepick';
import Tone from 'tone';

import Launchpad from './components/Launchpad';
import Score from './components/Score';
import Keyboard from './components/Keyboard';

const sampleNoteGroups = [
    [{ pitch: 'C4', duration: 1}],
    [{ pitch: 'D4', duration: 1}],
    [{ pitch: 'E4', duration: 1}],
    [{ pitch: 'F4', duration: 1}],
    [{ pitch: 'G4', duration: 1}],
    [{ pitch: 'A4', duration: 1}],
    [{ pitch: 'B4', duration: 1}],
    [{ pitch: 'C5', duration: 1}],
    [{ pitch: 'D5', duration: 1}],
];

function getDuration(duration, bpm) {
    return 16 / bpm * duration;
}

class ScoreState {
  constructor(options = {}) {
    this.bars = 1;
    this.playing = true;
    this.noteGroups = [];
    this.synth = new Tone.PolySynth(6, Tone.Synth, {
      // "oscillator" : {
      // 	"partials" : [0, 2, 3, 4],
      // }
    }).toMaster();

    Object.assign(this, options);
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentBeat: -1,
      currentTime: Date.now(),
      bpm: 120,
      scores: [
        new ScoreState({
          index: 0,
          noteGroups: sampleNoteGroups,
        }),
      ],
      score: null,
      mode: 'EDIT',
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        currentBeat: (this.state.currentBeat + 1) % 64,
        currentTime: Date.now(),
      });
    }, this.state.bpm);

    this.play();
  }
  componentWillUpdate(_, nextState) {
    if (this.state.currentBeat !== nextState.currentBeat) {
      this.play();
    }
  }
  handleClickScore(index) {
    const { mode } = this.state;

    if (mode === 'PLAY' && this.state.scores[index]) {
      this.setState({
        scores: i.setIn(this.state.scores, [index, 'playing'], !this.state.scores[index].playing)
      });
    } else {
      this.handleDoubleClickScore(index);
    }
  }
  handleDoubleClickScore(index) {
    if (!this.state.scores[index]) {
      const newScore = new ScoreState({ index });
      this.setState({
        scores: i.set(this.state.scores, index, newScore),
        score: newScore,
      });
    } else {
      this.setState({
        scores: i.setIn(this.state.scores, [index, 'playing'], true),
        score: this.state.scores[index],
      });
    }
  }
  play() {
      const { currentBeat, bpm, bars, scores } = this.state;

      scores.forEach(score => {
        if (!score) return;

        const { noteGroups, playing, synth, bars } = score;

        if (!playing) return;

        const noteGroup = noteGroups[currentBeat % (bars * 16)];

        if (noteGroup && noteGroup.length) {
            const pitches = noteGroup.map(({ pitch }) => pitch);
            const durations = noteGroup.map(({ duration }) => getDuration(duration, bpm));

            synth.triggerAttackRelease(pitches, durations);
        }
      });
  }
  updateScore(noteGroups) {
    this.setState({
      scores: i.setIn(this.state.scores, [this.state.score.index, 'noteGroups'], noteGroups),
    });
  }
  closeScore() {
    this.setState({
      score: null,
    });
  }
  renderScore() {
    const { score } = this.state;

    if (!score) return null;

    return (
      <Score
        currentBeat={this.state.currentBeat}
        currentTime={this.state.currentTime}
        playing={score.playing}
        bpm={this.state.bpm}
        noteGroups={score.noteGroups}
        bars={score.bars}
        onChange={score => this.updateScore(score)}
        onClose={() => this.closeScore()}
      />
    );
  }
  render() {
    return (
      <div className="ui-app">
        {this.renderScore()}
        <Launchpad
          rows={8}
          onClick={(index) => this.handleClickScore(index)}
          onDoubleClick={(index) => this.handleDoubleClickScore(index)}
          scores={this.state.scores}
        />
      </div>
    );
  }
}

export default App;
