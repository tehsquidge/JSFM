import React from 'react';

class OperatorModule extends React.Component {

  getConnectsToOptions () {
	let connectsToOptions = ['none','output'].concat(this.props.operators);
	let connectsToOptionsElements = [];
	for(let val of connectsToOptions) {
		if(this.props.operator != val){
			connectsToOptionsElements.push(<option key={val} value={val}>{ val[0].toUpperCase() + val.slice(1)}</option>);
		}
	}
	return connectsToOptionsElements;
  }

  getWaveTypeOptions () {
	let waveTypeOptions = ['sine','square','sawtooth','triangle'];
	let waveTypeOptionsElements = [];
	for(let val of waveTypeOptions) {
		waveTypeOptionsElements.push(<option key={val} value={val}>{ val[0].toUpperCase() + val.slice(1)}</option>);
	}
	return waveTypeOptionsElements;
  }

  render () {
    return (
			<fieldset className="cp-fieldset cp-fieldset--operator" data-operator={this.props.operator}>
				<legend>Operator {this.props.operator}</legend>
				<div className="cp-fieldset__cell cp-fieldset__cell--half">
					<label>To</label>
					<select name={"config."+this.props.operator+".connectsTo"} value={this.props.config.connectsTo} onChange={this.props.stateChange}>
						{ this.getConnectsToOptions() }
					</select>
				</div>
				<div className="cp-fieldset__cell cp-fieldset__cell--half">
					<label>Wave Type</label>
						<select name={"config."+this.props.operator+".waveType"} value={this.props.config.waveType} onChange={this.props.stateChange}> 
							{ this.getWaveTypeOptions() }
						</select>
				</div>
				<div className="cp-fieldset__cell cp-fieldset__cell--half">
					<label>Ratio</label>
						<input name={"config."+this.props.operator+".ratio"} type="number" onChange={this.props.stateChange} value={this.props.config.ratio}></input>
				</div>
				<div className="cp-fieldset__cell cp-fieldset__cell--half">
					<label>Detune</label>
						<input name={"config."+this.props.operator+".detune"} type="number"  onChange={this.props.stateChange} value={this.props.config.detune}></input>
				</div>
				<div className="cp-fieldset__cell cp-fieldset__cell--half">
				<label>modulation Factor</label>
						<input name={"config."+this.props.operator+".modulationFactor"} type="number"  onChange={this.props.stateChange} value={this.props.config.modulationFactor}></input>
				</div>
				<fieldset className="cp-fieldset">
						<legend>Amp Env</legend>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
								<label>Attack</label>
								<input name={"config."+this.props.operator+".ampEnv.attackTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.attackTime}></input>
						</div>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
								<label>Decay</label>
								<input name={"config."+this.props.operator+".ampEnv.decayAmount"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.decayAmount}></input>
						</div>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
							<label>Sustain</label>
								<input name={"config."+this.props.operator+".ampEnv.sustainLevel"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.sustainLevel}></input>
						</div>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
							<label>Release</label>
							<input name={"config."+this.props.operator+".ampEnv.releaseTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.releaseTime}></input>
						</div>
				</fieldset>
				<fieldset className="cp-fieldset">
						<legend>Pitch Env</legend>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
							<label>Attack</label>
							<input name={"config."+this.props.operator+".pitchEnv.attackTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.attackTime}></input>
						</div>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
							<label>Decay</label>
							<input name={"config."+this.props.operator+".pitchEnv.decayAmount"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.decayAmount}></input>
						</div>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
							<label>Sustain</label>
							<input name={"config."+this.props.operator+".pitchEnv.sustainLevel"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.sustainLevel}></input>
						</div>
						<div className="cp-fieldset__cell cp-fieldset__cell--half">
							<label>Release</label>
							<input name={"config."+this.props.operator+".pitchEnv.releaseTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.releaseTime}></input>
						</div>
				</fieldset>
			</fieldset>
    );
  }
}

export default OperatorModule;