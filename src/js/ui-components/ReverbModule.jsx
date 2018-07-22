import React from 'react';

class ReverbModule extends React.Component {
  render () {
    return (<fieldset className="reverb">
<legend>Reverb</legend>
<div>
    <label>
        Wet
        <input name="reverb.wet" type="range" value={this.props.reverb.wet} onChange={this.props.stateChange} min="0" step=".01" max="1"></input>
    </label>
    <label>
        Dry
        <input name="reverb.dry" type="range" value={this.props.reverb.dry} onChange={this.props.stateChange} min="0" step=".01" max="1"></input>
    </label>
</div>
<div>
    <label>
        Seconds
        <input name="reverb.seconds" type="range" value={this.props.reverb.seconds} onChange={this.props.stateChange} min="0.01" step=".01" max="10"></input>
    </label>
    <label>
        Decay
        <input name="reverb.decay" type="range" value={this.props.reverb.decay} onChange={this.props.stateChange} min="0.01" step=".01" max="10"></input>
    </label>
</div>
<label>
    Reverse
    <select name="reverb.reverse" value={this.props.reverb.reverse} onChange={this.props.stateChange}>
        <option value="1">On</option>
        <option value="0" selected>Off</option>
    </select>
</label>
<button id="reverbApply" onClick={this.props.applyReverb} className={this.props.modifiedStatus.reverb? 'attention' : ' '}>Apply</button>
</fieldset>
    );
}
}

export default ReverbModule;