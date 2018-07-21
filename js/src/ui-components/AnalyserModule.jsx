import React from 'react';

class AnalyserModule extends React.Component {
  render () {
    return (
		<fieldset className="analyser">
			<legend>Analyser</legend>
      <canvas ref="analyserCanvas"></canvas>
		</fieldset>
    );
  }
}

export default AnalyserModule;