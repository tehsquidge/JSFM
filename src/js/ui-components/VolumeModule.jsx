import React from 'react';

class VolumeModule extends React.Component {
  render () {
    return (
      <fieldset className="volume">
			<legend>Volume</legend>
			<label className="center">Volume
        <input name="volume" className="vert" type="range" value={this.props.volume} onChange={this.props.stateChange} min="0" step=".001" max="1"/>
			</label>
		</fieldset>
    );
  }
}

export default VolumeModule;