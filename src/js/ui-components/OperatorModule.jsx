import React from 'react';
import {combinations} from '../utils';

class OperatorModule extends React.Component {

  getConnectsToOptions () {
	const otherOps = this.props.operators.filter( op => this.props.operator !== op);
	let connectsToOptions = ['none','output'];

	const operatorMap = combinations(otherOps).map( combi => {
		return combi.join(" + ")
	}).filter( c => c !== "").sort();
	connectsToOptions = connectsToOptions.concat(operatorMap);

	let connectsToOptionsElements = [];
	for(let val of connectsToOptions) {
			connectsToOptionsElements.push(<option key={val} value={val}>{ val }</option>);
	}
	return connectsToOptionsElements;
  }

  getWaveTypeOptions () {
	let waveTypeOptions = ['sine','square','sawtooth','triangle'];
	let waveTypeOptionsElements = [];
	for(let val of waveTypeOptions) {
		waveTypeOptionsElements.push(<option key={val} value={val}>{ val }</option>);
	}
	return waveTypeOptionsElements;
  }

  getFreqModeOptions () {
	let freqModeOptions = ['ratio','fixed'];
	let freqModeOptionsElements = [];
	for(let val of freqModeOptions) {
		freqModeOptionsElements.push(<option key={val} value={val}>{ val }</option>);
	}
	return freqModeOptionsElements;
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
					<label>Freq. Mode</label>
						<select name={"config."+this.props.operator+".frequencyMode"} onChange={this.props.stateChange} value={this.props.config.frequencyMode}>
							{ this.getFreqModeOptions() }
						</select>
				</div>
				<div className={`cp-fieldset__cell cp-fieldset__cell--half ${this.props.config.frequencyMode == 'fixed'? '' : 'hidden'}`}>
					<label>Frequency</label>
						<input name={"config."+this.props.operator+".fixedFrequency"} type="number" onChange={this.props.stateChange} value={this.props.config.fixedFrequency}></input>
				</div>
				<div className={`cp-fieldset__cell cp-fieldset__cell--half ${this.props.config.frequencyMode == 'ratio'? '' : 'hidden'}`}>
					<label>Ratio</label>
						<input name={"config."+this.props.operator+".ratio"} type="number" onChange={this.props.stateChange} value={this.props.config.ratio}></input>
				</div>
				<div className="cp-fieldset__cell cp-fieldset__cell--half">
					<label>Detune</label>
						<input name={"config."+this.props.operator+".detune"} type="number"  onChange={this.props.stateChange} value={this.props.config.detune}></input>
				</div>
				<div className={` cp-fieldset__cell cp-fieldset__cell--half ${this.props.config.connectsTo == 'output'? 'invisible' : ''} `}>
				<label>Modulation Factor</label>
						<input name={"config."+this.props.operator+".modulationFactor"} type="number"  onChange={this.props.stateChange} value={this.props.config.modulationFactor}></input>
				</div>
				<div className={` cp-fieldset__cell cp-fieldset__cell `}>
				<label>Feedback</label>
						<input name={"config."+this.props.operator+".feedback"} type="number"  onChange={this.props.stateChange} value={this.props.config.feedback}></input>
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