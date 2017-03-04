import React from 'react';
import Tone from 'tone';

const sampleNoteGroups = [
    [{ pitch: 'C4', duration: 1}],
    [{ pitch: 'Eb4', duration: 1}],
    [{ pitch: 'A4', duration: 1}],
    // [{ pitch: 'F4', duration: 1}],
    [{ pitch: 'C5', duration: 1}],
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
            playing: true,
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
        const { noteGroups } = this.state;

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
            </div>
        );
    }
}

export default Score;
