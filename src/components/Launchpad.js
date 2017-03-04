import React from 'react';

class Launchpad extends React.Component {
    render() {
        const { rows } = this.props;

        const width = 100 / rows;

        return (
            <div className="ui-launchpad">
            {Array(rows * rows).fill(null).map((_, i) =>
                <div
                    className="ui-launchpad-button"
                    key={i}
                    style={{
                        width: `${width}%`,
                        height: `${width}%`,
                        top: `${width * Math.floor(i / rows)}%`,
                        left: `${width * Math.floor(i % rows)}%`,                        
                    }}
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
