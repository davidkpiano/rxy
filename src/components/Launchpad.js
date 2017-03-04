import React from 'react';

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
        const { onClick, onDoubleClick, style } = this.props;

        return (
            <div
                className="ui-launchpad-button"
                style={style}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            />
        )
    }
}

class Launchpad extends React.Component {
    render() {
        const { rows, onClick, onDoubleClick } = this.props;

        const width = 100 / rows;

        return (
            <div className="ui-launchpad">
            {Array(rows * rows).fill(null).map((_, i) =>
                <LaunchpadButton
                    key={i}
                    style={{
                        width: `${width}%`,
                        height: `${width}%`,
                        top: `${width * Math.floor(i / rows)}%`,
                        left: `${width * Math.floor(i % rows)}%`,
                    }}
                    onClick={() => onClick(i)}
                    onDoubleClick={() => onDoubleClick(i)}
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
