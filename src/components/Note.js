import React from 'react';
import cn from 'classnames';

import { pitchIndex } from '../utils/pitch';

class Note extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            lastX: 0,
            lastY: 0,
            editing: false,
            augmenting: false,
            moving: false,
            pitch: props.pitch,
            beat: props.beat,
            duration: props.duration,
        }
    }
    addNode(node) {
        if (!node) return;

        this.node = node;
    }
    handleDragStart(e) {
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];

        this.setState({
            x: touch.clientX,
            y: touch.clientY,
            lastX: touch.clientX,
            lastY: touch.clientY,
        });
    }
    handleDragMove(e) {
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];

        const { x, y } = this.state;

        this.setState({
            lastX: touch.clientX,
            lastY: touch.clientY,
        });
    }
    handleDragEnd(e) {
        const { onClick, onMove } = this.props;

        e.preventDefault();
        e.stopPropagation();

        const rect = this.node.getBoundingClientRect();
        const { x, y, lastX, lastY } = this.state;

        const dx = x - lastX;
        const dy = y - lastY;

        if (Math.abs(dx) < 50 && Math.abs(dy) < 50) {
            onMove && onMove(false)
        } else {
            const pos = {
                x: lastX,
                y: lastY,
            };

            onMove && onMove(pos);
        }


        this.setState({
            x: 0,
            y: 0,
            lastX: 0,
            lastY: 0,
        });
    }
    render() {
        const {
            pitch,
            beat,
            duration,
            onClick,
            temporary,
            x, lastX,
            y, lastY,
        } = this.state;

        console.log(x, y);

        return (
            <div
                ref={node => this.addNode(node)}
                className={cn('ui-note', temporary && '-temporary')}
                key={pitch + beat}
                style={{
                    left: `${beat * 100 / 16}%`,
                    bottom: `${pitchIndex(pitch) * 100 / 15}%`,
                    width: `${duration * 100 / 16}%`,
                    transform: `translate(${lastX - x}px, ${lastY - y}px)`,
                }}
                onTouchStart={(e) => {
                    this.handleDragStart(e);
                }}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.handleDragEnd(e);
                }}
                onTouchMove={(e) => {
                    this.handleDragMove(e);                    
                }}
            />
        );
    }
}

export default Note;
