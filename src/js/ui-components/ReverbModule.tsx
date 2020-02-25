import React from 'react';
import { ReverbConfigInterface } from '../types/Effects';
import { ModifiedStatusInterface } from '../types/Main';

export interface ReverbModulePropsInterface {
    reverb: ReverbConfigInterface;
    stateChange(): Event;
    applyReverb(): Event;
    modifiedStatus: ModifiedStatusInterface;
}

class ReverbModule extends React.Component<ReverbModulePropsInterface> {
  render () {
    return (
<fieldset className="cp-fieldset cp-fieldset--reverb">
    <legend>Reverb</legend>
    <div className="cp-fieldset__cell cp-fieldset__cell--half">
        <label>Wet</label>
        <input name="reverb.wet" type="range" value={this.props.reverb.wet} onChange={this.props.stateChange} min="0" step=".01" max="1"></input>
    </div>
    <div className="cp-fieldset__cell cp-fieldset__cell--half">
        <label>Dry</label>
        <input name="reverb.dry" type="range" value={this.props.reverb.dry} onChange={this.props.stateChange} min="0" step=".01" max="1"></input>
    </div>
    <div className="cp-fieldset__cell cp-fieldset__cell--half">
        <label>Seconds</label>
        <input name="reverb.seconds" type="range" value={this.props.reverb.seconds} onChange={this.props.stateChange} min="0.01" step=".01" max="10"></input>
    </div>
    <div className="cp-fieldset__cell cp-fieldset__cell--half">
        <label>Decay</label>
        <input name="reverb.decay" type="range" value={this.props.reverb.decay} onChange={this.props.stateChange} min="0.01" step=".01" max="10"></input>
    </div>
    <div className="cp-fieldset__cell cp-fieldset__cell--half">
        <label>Reverse</label>
        <select name="reverb.reverse" value={this.props.reverb.reverse? 1 : 0 } onChange={this.props.stateChange}>
            <option value="1">On</option>
            <option value="0">Off</option>
        </select>
    </div>
    <button id="reverbApply" onClick={this.props.applyReverb} className={this.props.modifiedStatus.reverb? 'attention' : ' '}>Apply</button>
</fieldset>
    );
}
}

export default ReverbModule;