import React from 'react';
import Tone from 'tone';

import Keyboard from './Keyboard';

const sampleNoteGroups = [
    [{ pitch: 'C4', duration: 1}],
    [{ pitch: 'Eb4', duration: 1}],
    [{ pitch: 'A4', duration: 1}],
    // [{ pitch: 'F4', duration: 1}],
    [{ pitch: 'C5', duration: 1}],
];

function pitchIndex(pitch, fromKey = 'C') {
    const [_, pitchKey, octave] = pitch.match(/^(.*)(\d)$/);

    const [pitchNote, pitchAccidental] = pitchKey;

    let index = pitchNote.charCodeAt() - fromKey.charCodeAt();

    if (pitchAccidental) {
        index += pitchAccidental === 'b' ? -0.5 : 0.5;
    }

    return index;
}

function getDuration(duration, bpm) {
    return 16 / bpm * duration;
}

class Score extends React.Component {
    constructor() {
        super();

        this.state = {
            noteGroups: sampleNoteGroups,
            playing: false,
            beat: 1,
        };

        this.synth = new Tone.PolySynth(6, Tone.Synth, {
			// "oscillator" : {
			// 	"partials" : [0, 2, 3, 4],
			// }
		}).toMaster();
    }
    componentDidMount() {
        this.attack();
    }
    componentWillReceiveProps(nextProps) {
        const { currentBeat } = this.props;

        if (currentBeat !== nextProps.currentBeat) {
            this.attack();
        }
    }
    attack() {
        const { currentBeat, bpm } = this.props;
        const { noteGroups, playing } = this.state;

        if (!playing) return;

        const noteGroup = noteGroups[currentBeat];

        if (noteGroup && noteGroup.length) {
            const pitches = noteGroup.map(({ pitch }) => pitch);
            const durations = noteGroup.map(({ duration }) => getDuration(duration, bpm));

            this.synth.triggerAttackRelease(pitches, durations);
        }
    }

    handleClickScore(e) {
        e.persist();

        console.log(e);
    }

    render() {
        const {
            bars,
        } = this.props;
        const {
            noteGroups,
        } = this.state;

        const notes = noteGroups
            .map((noteGroup, i) => noteGroup.map(note => ({
                ...note,
                beat: i,
            })))
            .reduce((a, b) => a.concat(b), []);

        return (
            <div
                className="ui-score"
                onClick={(e) => this.handleClickScore(e)}
            >
                {notes.map(note => (
                    <div
                        className="ui-note"
                        key={note.pitch + note.beat}
                        style={{
                            left: `${note.beat * 100 / 32}%`,
                            top: `${pitchIndex(note.pitch) * 100 / 29}%`,
                            width: `${note.duration * 100 / 32}%`,
                        }}
                        onClick={() => this.synth.triggerAttackRelease(note.pitch, '16n')}
                    />
                ))}
                <Keyboard />
            </div>
        );
    }
}

export default Score;
