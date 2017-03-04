import React from 'react';
import Tone from 'tone';

const KEYS = [
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
]

class Key extends React.Component {
    constructor() {
        super();

        this.state = {
            start: null,
            end: null,
        }
    }
    handleAttack() {
        const { synth, pitch } = this.props;

        this.setState({
            start: Date.now(),
        });

        synth.triggerAttack(pitch);
    }
    handleRelease() {
        const { synth, pitch, onPlay } = this.props;

        synth.triggerRelease(pitch);

        onPlay && onPlay({
            pitch,
            start: this.state.start,
            end: Date.now(),
        });
    }
    render() {
        return (
            <div
                className="ui-key"
                onMouseDown={() => this.handleAttack()}
                onMouseUp={() => this.handleRelease()}
            />
        );
    }
}

class Keyboard extends React.Component {
    constructor() {
        super();

        this.state = {

        }

        this.synth = new Tone.PolySynth(6, Tone.Synth, {
			// "oscillator" : {
			// 	"partials" : [0, 2, 3, 4],
			// }
		}).toMaster();
    }

    render() {
        const {
            octave = 4,
            onPlay = (a) => console.log(a),
        } = this.props;

        return (
            <div className="ui-keyboard">
                {Array(13).fill(null).map((_, i) =>
                    <Key
                        key={i}
                        synth={this.synth}
                        pitch={`${KEYS[i % 12]}${i === 12 ? octave + 1 : octave}`}
                        onPlay={onPlay}
                    />
                )}
            </div>
        )
    }
}


export default Keyboard;
