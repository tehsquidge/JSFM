import React from 'react';

class ChorusModule extends React.Component {
  render () {
    return (
<fieldset className="cp-fieldset cp-fieldset--chorus">
    <legend>Chorus</legend>
    <div className="cp-fieldset__cell">
        <label>Wet</label>
        <input name="chorus.wet" type="range" value={this.props.chorus.wet} onChange={this.props.stateChange} min="0.00001" step=".00001" max="0.5"></input>
    </div>
    <div className="cp-fieldset__cell">
        <label>Depth</label>
        <input name="chorus.depth" type="range" value={this.props.chorus.depth} onChange={this.props.stateChange} min="0.00001" step=".00001" max="0.05"></input>
    </div>
    <div className="cp-fieldset__cell">
        <label>Rate</label>
        <input name="chorus.rate" type="number" value={this.props.chorus.rate} onChange={this.props.stateChange} min="0" step=".001" max="1"></input>
    </div>
    <div className="cp-fieldset__cell">
        <button  onClick={this.props.applyChorus} className={this.props.modifiedStatus.chorus? 'attention' : ' '}>Apply</button>
    </div>
</fieldset>
    );
}
}

export default ChorusModule;