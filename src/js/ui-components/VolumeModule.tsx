import React from 'react';

import { ReverbConfigInterface } from '../types/Effects';
import { ModifiedStatusInterface } from '../types/Main';

export interface VolumeModulePropsInterface {
    volume: number;
    stateChange(): Event;
}


class VolumeModule extends React.Component<VolumeModulePropsInterface>{
  render () {
    return (
      <fieldset className="cp-fieldset">
			<legend>Volume</legend>
      <div className="cp-fieldset--half-cell">
			  <label className="center">Volume</label>
        <input name="volume" className="vert" type="range" value={this.props.volume} onChange={this.props.stateChange} min="0" step=".001" max="1"/>
			</div>
		</fieldset>
    );
  }
}

export default VolumeModule;