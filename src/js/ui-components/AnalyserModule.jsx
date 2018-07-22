import React from 'react';

class AnalyserModule extends React.Component {
  render () {
    return (
		<fieldset className="cp-fieldset">
			<legend>Analyser</legend>
      <canvas ref="analyserCanvas"></canvas>
		</fieldset>
    );
  }
}

export default AnalyserModule;