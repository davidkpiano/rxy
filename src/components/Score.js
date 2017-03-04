import React from 'react';
import Tone from 'tone';
import i from 'icepick';

import Keyboard from './Keyboard';

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

const pitches = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
];

function getScale(fromPitch, type = 'MAJOR') {
    const pitchIndex = pitches.indexOf(fromPitch);
    switch (type) {
        case 'MAJOR':
        default:
            return [0, 2, 4, 5, 7, 9, 11]
                .map(i => pitches[(i + pitchIndex) % 12]);
    }
}

function pitchMeta(pitch) {
    const [_, note, octave] = pitch.match(/^(.*)(\d)$/);

    return {
        note,
        octave: +octave,
    }
}

function pitchIndex(pitch, fromPitch = 'C4') {
    const { note, octave } = pitchMeta(pitch);
    const { note: fromNote, octave: fromOctave } = pitchMeta(fromPitch);

    const scale = getScale(fromNote);

    let index = scale.indexOf(note);

    index += (octave - fromOctave) * 7;

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
    addNode(node) {
        if (!node) return;

        this.node = node;

        const rect = node.getBoundingClientRect();

        this.cellSize = {
            height: rect.height / 29,
            width: rect.width / 32,
        };
    }
    attack() {
        const { currentBeat, bpm, bars } = this.props;
        const { noteGroups, playing } = this.state;

        if (!playing) return;

        const noteGroup = noteGroups[currentBeat % (bars * 16)];

        if (noteGroup && noteGroup.length) {
            const pitches = noteGroup.map(({ pitch }) => pitch);
            const durations = noteGroup.map(({ duration }) => getDuration(duration, bpm));

            this.synth.triggerAttackRelease(pitches, durations);
        }
    }

    handleClickScore(e) {
        const { keySignature } = this.props;
        const { note, octave: fromOctave } = pitchMeta(keySignature);
        const scale = getScale(note);

        const octave = Math.floor((e.clientY / this.cellSize.height) / 7) + fromOctave;

        this.addNote({
            beat: Math.floor(e.clientX / this.cellSize.width),
            pitch: `${scale[Math.floor(e.clientY / this.cellSize.height) % 7]}${octave}`,
            duration: 1,
        });
    }

    handlePlayNote(note) {
        const {
            currentTime,
            currentBeat,
            bpm,
            bars,
        } = this.props;

        const duration = Math.round((note.end - note.start) / (1000 * 60 * 4 / (bpm * 16)));

        let beat = (currentBeat - duration) % (bars * 16);
        if (beat < 0) beat = bars * 16 - beat;

        this.addNote({
            beat,
            pitch: note.pitch,
            duration,
        });
    }

    addNote(note) {
        console.log(note);
        this.setState({
            noteGroups: i.set(
                this.state.noteGroups, note.beat,
                i.push(this.state.noteGroups[note.beat] || [], note)),
        });
    }

    render() {
        const {
            bars,
        } = this.props;
        const {
            noteGroups,
        } = this.state;

        const notes = noteGroups
            .map((noteGroup, i) => {
                if (!noteGroup) return [];

                return noteGroup.map(note => ({
                    ...note,
                    beat: i,
                }));
            })
            .reduce((a, b) => a.concat(b), []);

        return (
            <div
                className="ui-score"
                onClick={(e) => this.handleClickScore(e)}
                ref={(node) => this.addNode(node)}
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.synth.triggerAttackRelease(note.pitch, '16n');
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    />
                ))}
                {true &&
                    <Keyboard onPlay={(note) => this.handlePlayNote(note)} />
                }
            </div>
        );
    }
}

Score.defaultProps = {
    bars: 1,
    keySignature: 'C4',
};

export default Score;
