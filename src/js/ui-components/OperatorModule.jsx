import React from 'react';
import {combinations} from '../utils';
import EnvelopeModule from './EnvelopeModule.jsx';

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
				<EnvelopeModule title="Amp Env" type="ampEnv" modifierProps = { { label: "volume", min: 0, max: 1.0, step: 0.05, type: "range" } }
				stateChange={this.props.stateChange}
				operator={this.props.operator}
				{...this.props.config.ampEnv}></EnvelopeModule>
				<EnvelopeModule title="Pitch Env" type="pitchEnv" modifierProps={ { label: "octave", min: 1, max: 10, step: 1, type: "range"  } }
				stateChange={this.props.stateChange}
				operator={this.props.operator}
				{...this.props.config.pitchEnv}></EnvelopeModule>
			</fieldset>
    );
  }
}

export default OperatorModule;