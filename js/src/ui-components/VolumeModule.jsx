import React from 'react';

class VolumeModule extends React.Component {
  render () {
    return (
      <fieldset className="volume">
			<legend>Volume</legend>
			<label class="center" for="volume">Volume
				<input id="volume" class="vert" type="range" value=".8" min="0" step=".001" max="1"/>
			</label>
		</fieldset>
    );
  }
}

export default VolumeModule;