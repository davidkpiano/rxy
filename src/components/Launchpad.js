import React from 'react';
import cn from 'classnames';

class LaunchpadButton extends React.Component {
    constructor() {
        super();

        this.state = {
            selected: false,
        };
    }
    handleClick() {
        if (this.state.selected) {

        }
    }
    render() {
        const { onClick, style, score } = this.props;

        return (
            <div
                className={cn('ui-launchpad-button', {
                    '-active': score && score.playing,
                    '-score': score,
                })}
                style={style}
                onClick={onClick}
            />
        )
    }
}

class Launchpad extends React.Component {
    render() {
        const { rows, onClick, scores } = this.props;

        const width = 100 / rows;

        return (
            <div className="ui-launchpad">
            {Array(rows * rows).fill(null).map((_, i) =>
                <LaunchpadButton
                    score={scores[i]}
                    key={i}
                    style={{
                        width: `${width}%`,
                        height: `${width}%`,
                        top: `${width * Math.floor(i / rows)}%`,
                        left: `${width * Math.floor(i % rows)}%`,
                    }}
                    onClick={() => onClick(i)}
                />
            )}
            </div>
        );
    }
}

Launchpad.defaultProps = {
    rows: 8,
};

export default Launchpad;
