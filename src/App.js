import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';
import i from 'icepick';
import Tone from 'tone';
import Range from 'react-input-range';
import 'react-input-range/lib/css/index.css';

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
      selected: 0,
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
    const { mode, score } = this.state;

    if (mode === 'PLAY' && this.state.scores[index]) {
      this.setState({
        scores: i.setIn(this.state.scores, [index, 'playing'], !this.state.scores[index].playing)
      });
    } else if (mode === 'EDIT') {
      this.selectEditScore(index);
    }
  }
  selectEditScore(index) {
    const score = this.state.scores[index];
    if (!score) {
      const newScore = new ScoreState({ index });
      this.setState({
        scores: i.set(this.state.scores, index, newScore),
        score: newScore,
      });
    } else {
      if (this.state.selected !== index) {
        this.setState({ selected: index });
      } else {
        this.setState({
          scores: i.setIn(this.state.scores, [index, 'playing'], true),
          score: score,
        });
      }
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
  switchMode() {
    this.setState({
      mode: this.state.mode === 'EDIT' ? 'PLAY' : 'EDIT',
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
  setSynth(attr, val) {
    const score = this.state.scores[this.state.selected];
    const synth = score.synth;

    synth.set(attr, val);
  }
  getSynth(attr) {
    const score = this.state.scores[this.state.selected];
    const synth = score.synth;

    console.log(synth.get('detune'));

    return synth.get(attr)[attr];
  }
  render() {
    const { mode } = this.state;

    return (
      <div className="ui-app">
        {this.renderScore()}
        <Launchpad
          rows={8}
          onClick={(index) => this.handleClickScore(index)}
          onDoubleClick={(index) => this.handleDoubleClickScore(index)}
          scores={this.state.scores}
          selected={this.state.selected}
        />
        <aside className="ui-aside">
          <button
            className="ui-button"
            onClick={() => this.switchMode()}
          >
            {mode === 'EDIT' ? 'PLAY' : 'EDIT'}
          </button>
          <label className="ui-label">Detune</label>
          <Range
            type="range"
            minValue={-1200}
            maxValue={1200}
            step={100}
            onChange={value => this.setSynth('detune', value)}
            value={this.getSynth('detune')}
          />
          <label className="ui-label">Volume</label>          
          <Range
            type="range"
            minValue={-10}
            maxValue={10}
            step={1}
            onChange={value => this.setSynth('volume', value)}
            value={this.getSynth('volume')}
          />
          <button className="ui-button -icon" onClick={() => this.setSynth('oscillator', {type: 'triangle'})}>
            △
          </button>
          <button className="ui-button -icon" onClick={() => this.setSynth('oscillator', {type: 'sine'})}>
            ~
          </button>
        </aside>
      </div>
    );
  }
}

export default App;
