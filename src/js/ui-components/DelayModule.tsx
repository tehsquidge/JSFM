import React from 'react';
import { DelayConfigInterface } from '../types/Effects';
import { ModifiedStatusInterface } from '../types/Main';

export interface DelayModulePropsInterface {
    delay: DelayConfigInterface;
    stateChange(e: React.ChangeEvent): void;
    applyDelay(e: React.MouseEvent): void;
    modifiedStatus: ModifiedStatusInterface;
}

class DelayModule extends React.Component<DelayModulePropsInterface> {
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