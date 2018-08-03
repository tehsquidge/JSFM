import React from 'react';

class ReverbModule extends React.Component {
  render () {
    return (
<fieldset className="cp-fieldset cp-fieldset--reverb">
    <legend>Reverb</legend>
    <div className="cp-fieldset__half-cell">
        <label>Wet</label>
        <input name="reverb.wet" type="range" value={this.props.reverb.wet} onChange={this.props.stateChange} min="0" step=".01" max="1"></input>
    </div>
    <div className="cp-fieldset__half-cell">
        <label>Dry</label>
        <input name="reverb.dry" type="range" value={this.props.reverb.dry} onChange={this.props.stateChange} min="0" step=".01" max="1"></input>
    </div>
    <div className="cp-fieldset__half-cell">
        <label>Seconds</label>
        <input name="reverb.seconds" type="range" value={this.props.reverb.seconds} onChange={this.props.stateChange} min="0.01" step=".01" max="10"></input>
    </div>
    <div className="cp-fieldset__half-cell">
        <label>Decay</label>
        <input name="reverb.decay" type="range" value={this.props.reverb.decay} onChange={this.props.stateChange} min="0.01" step=".01" max="10"></input>
    </div>
    <div className="cp-fieldset__half-cell">
        <label>Reverse</label>
        <select name="reverb.reverse" value={this.props.reverb.reverse} onChange={this.props.stateChange}>
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