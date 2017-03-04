import React from 'react';

import { pitchIndex } from '../utils/pitch';

class Note extends React.Component {
    constructor() {
        super();

        this.state = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            editing: false,
            augmenting: false,
            moving: false,
        }
    }
    handleDragStart(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log(e.clientX);

        this.setState({
            editing: true,
            augmenting: e
        })
    }
    addNode(node) {
        if (!node) return;

        this.node = node;
        
        const rect = node.getBoundingClientRect();

        this.rect = rect;
    }
    render() {
        const {
            pitch,
            beat,
            duration,
            onClick,
        } = this.props;

        return (
            <div
                ref={node => this.addNode(node)}
                className="ui-note"
                key={pitch + beat}
                style={{
                    left: `${beat * 100 / 32}%`,
                    top: `${pitchIndex(pitch) * 100 / 29}%`,
                    width: `${duration * 100 / 32}%`,
                }}
                onClick={(e) => {
                    console.log('yeah');
                    e.preventDefault();
                    e.stopPropagation();
                    onClick && onClick({ pitch, beat });
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />
        );
    }
}

export default Note;
