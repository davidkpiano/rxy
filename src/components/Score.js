import React from 'react';
import Tone from 'tone';

const sampleNoteGroups = [
    [{ pitch: 'C4', duration: 1}],
    [{ pitch: 'D4', duration: 1}, { pitch: 'F4', duration: 1}],
    [{ pitch: 'E4', duration: 1}],
    [{ pitch: 'F4', duration: 1}],
    [{ pitch: 'G4', duration: 1}],
]

//create a synth and connect it to the master output (your speakers)
// var synth = new Tone.Synth(6, Tone.Synth, {
// 			"oscillator" : {
// 				"partials" : [0, 2, 3, 4],
// 			}
// 		}).toMaster();

//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");

function pitchIndex(pitch, fromKey = 'C') {
    const [pitchKey, octave] = pitch;

    const index = pitchKey.charCodeAt() - fromKey.charCodeAt();

    return index;
}

class Score extends React.Component {
    constructor() {
        super();

        this.state = {
            playing: true,
            beat: 1,
        };

        this.synth = new Tone.PolySynth(6, Tone.Synth, {
			"oscillator" : {
				"partials" : [0, 2, 3, 4],
			}
		}).toMaster();

        // this.synth.triggerAttackRelease(['C4','D4','F4'], 2)
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
        const { currentBeat, noteGroups } = this.props;

        const noteGroup = noteGroups[currentBeat];

        if (noteGroup && noteGroup.length) {
            const pitches = noteGroup.map(({ pitch }) => pitch);
            const durations = noteGroup.map(({ duration }) => duration);

            console.log(noteGroup);

            this.synth.triggerAttackRelease(pitches, durations);
        }
    }
    render() {
        const {
            bars,
            noteGroups = sampleNoteGroups,
        } = this.props;

        const notes = noteGroups.reduce((a, b) => a.concat(b), []);

        return (
            <div className="ui-score">
            {notes.map((note, i) => (
                <div
                    className="ui-note"
                    key={i}
                    style={{
                        left: `${i * 100 / 32}%`,
                        top: `${pitchIndex(note.pitch) * 100 / 29}%`,
                        width: `${note.duration * 100 / 32}%`,
                    }}
                    onClick={() => this.synth.triggerAttackRelease(note.pitch, '16n')}
                />
            ))}
            </div>
        );
    }
}

export default Score;
