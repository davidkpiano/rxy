import React from 'react';
import Tone from 'tone';
import i from 'icepick';

import Keyboard from './Keyboard';
import Note from './Note';

import { pitchIndex, pitchMeta, getScale } from '../utils/pitch';

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

class Score extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            noteGroups: props.noteGroups,
            playing: true,
            beat: 1,
            x: null,
            y: null,
        };

        this.synth = new Tone.PolySynth(6, Tone.Synth, {
			// "oscillator" : {
			// 	"partials" : [0, 2, 3, 4],
			// }
		}).toMaster();
    }
    componentDidMount() {
        this.updateNotes();
    }
    addNode(node) {
        if (!node) return;

        this.node = node;

        const rect = node.getBoundingClientRect();

        this.cellSize = {
            height: rect.height / 15,
            width: rect.width / 16,
        };
        this.rect = rect;
    }

    handleClickScore(x, y, dx = 0) {
        this.addNote(this.getNote(x, y, dx));
    }

    getNote(x, y, dx, duration) {
        const { keySignature } = this.props;
        const { note, octave: fromOctave } = pitchMeta(keySignature);
        const scale = getScale(note);

        const { height } = this.rect;

        const octave = Math.floor(((height - y) / this.cellSize.height) / 7) + fromOctave;

        console.log(this.rect);
        return {
            beat: Math.floor(x / this.cellSize.width),
            pitch: `${scale[Math.floor((height - y) / this.cellSize.height) % 7]}${octave}`,
            duration: duration || Math.max(1, Math.ceil(dx / this.cellSize.width)),
        };
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
        // see if note exists
        const updatedNoteGroup = (this.state.noteGroups[note.beat] || [])
            .filter(_note => note.pitch !== _note.pitch);

        this.setState({
            noteGroups: i.set(
                this.state.noteGroups, note.beat,
                i.push(updatedNoteGroup || [], note)),
        }, () => this.updateNotes());
    }

    updateNotes() {
        const { onChange } = this.props;
        const { noteGroups } = this.state;

        onChange(noteGroups);

        const notes = noteGroups
            .map((noteGroup, i) => {
                if (!noteGroup) return [];

                return noteGroup.map(note => ({
                    ...note,
                    beat: i,
                }));
            })
            .reduce((a, b) => a.concat(b), []);

        this.setState({ notes });
    }

    handleDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];

        this.setState({
            x: touch.clientX,
            y: touch.clientY,
        });
    }

    handleDragMove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.x) return;

        const touch = e.touches[0];

        this.setState({
            dx: touch.clientX - this.state.x,
            y: touch.clientY,
        });
    }

    handleDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.x) return;

        const touch = e.touches[0];

        // const dx = Math.abs(this.state.x - touch.clientX);
        // const x = Math.min(this.state.x, touch.clientX);
        const { x, y, dx } = this.state;

        this.handleClickScore(x, y, dx);
        this.setState({
            x: null,
            y: null,
            dx: null,
        });
    }

    moveNote(note, pos) {
        console.log(note);
        const newNote = this.getNote(pos.x, pos.y, undefined, note.duration);

        const { noteGroups } = this.state;

        this.setState({
            noteGroups: i
                .set(noteGroups, note.beat, noteGroups[note.beat]
                .filter(_note => note.pitch !== _note.pitch)),
        }, () => {
            this.updateNotes();    
            // If the note was moved
            if (pos) {
                console.log(newNote);
                this.addNote(newNote);
            }
        });

    }

    renderTempNote() {
        const { x, y, dx } = this.state;

        if (!x) return null;

        const note = this.getNote(x, y, dx);

        return (
            <Note
                temporary
                key={note.pitch + note.beat}
                pitch={note.pitch}
                beat={note.beat}
                duration={note.duration}
            />
        );
    }

    render() {
        const {
            bars,
            onClose,
        } = this.props;
        const {
            notes,
        } = this.state;

        return (
            <div
                className="ui-score"
                onTouchStart={e => this.handleDragStart(e)}
                onTouchMove={e => this.handleDragMove(e)}
                onTouchEnd={e => this.handleDragEnd(e)}             
                ref={(node) => this.addNode(node)}
            >
                {notes && notes.map(note => (
                    <Note
                        key={note.pitch + note.beat}
                        pitch={note.pitch}
                        beat={note.beat}
                        duration={note.duration}
                        onMove={(pos) => this.moveNote(note, pos)}
                    />
                ))}
                {this.renderTempNote()}
                {false &&
                    <Keyboard onPlay={(note) => this.handlePlayNote(note)} />
                }
                <div onClick={onClose}>Exit</div>
            </div>
        );
    }
}

Score.defaultProps = {
    bars: 1,
    keySignature: 'C4',
};

export default Score;
