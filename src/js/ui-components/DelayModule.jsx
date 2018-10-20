import React from 'react';

class DelayModule extends React.Component {
  render () {
    return (
<fieldset className="cp-fieldset cp-fieldset--delay">
    <legend>Delay</legend>
    <div className="cp-fieldset__cell">
        <label>Feedback</label>
        <input name="delay.feedback" type="range" value={this.props.delay.feedback} onChange={this.props.stateChange} min="0.00001" step=".00001" max="1"></input>
    </div>
    <div className="cp-fieldset__cell">
        <label>Time</label>
        <input name="delay.time" type="number" value={this.props.delay.time} onChange={this.props.stateChange} min="0" step=".001" max="10"></input>
    </div>
    <div className="cp-fieldset__cell">
        <button  onClick={this.props.applyDelay} className={this.props.modifiedStatus.delay? 'attention' : ' '}>Apply</button>
    </div>
</fieldset>
    );
}
}

export default DelayModule;