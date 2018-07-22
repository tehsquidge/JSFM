import React from 'react';

class OperatorModule extends React.Component {

  render () {
    return (
<fieldset className="cp-fieldset cp-fieldset--operator" data-operator={this.props.operator}>
				<legend>Operator {this.props.operator}</legend>
				<div className="cp-fieldset__half-cell">
					<label>To</label>
					<select name={"config."+this.props.operator+".connectsTo"}  onChange={this.props.stateChange} value={this.props.config.connectsTo}>
						<option value="none">None</option>
						<option value="output">Output</option>
                        {this.props.operators.map( function(op){ if(op != this.props.operator){ return <option key={op} value={op}>{op.toString().toUpperCase()}</option>  }  }.bind(this) )}
					</select>
				</div>
				<div className="cp-fieldset__half-cell">
					<label>Wave Type</label>
						<select name={"config."+this.props.operator+".waveType"}  onChange={this.props.stateChange} value={this.props.config.waveType}> 
							<option value="sine">Sine</option>
							<option value="square">Square</option>
							<option value="sawtooth">Sawtooth</option>
							<option value="triangle">Triangle</option>
						</select>
				</div>
				<div className="cp-fieldset__half-cell">
					<label>Ratio</label>
						<input name={"config."+this.props.operator+".ratio"} type="number" onChange={this.props.stateChange} value={this.props.config.ratio}></input>
				</div>
				<div className="cp-fieldset__half-cell">
					<label>Detune</label>
						<input name={"config."+this.props.operator+".detune"} type="number"  onChange={this.props.stateChange} value={this.props.config.detune}></input>
				</div>
				<div className="cp-fieldset__half-cell">
				<label>modulation Factor</label>
						<input name={"config."+this.props.operator+".modulationFactor"} type="number"  onChange={this.props.stateChange} value={this.props.config.modulationFactor}></input>
				</div>
				<fieldset className="cp-fieldset">
						<legend>Amp Env</legend>
						<div className="cp-fieldset__half-cell">
								<label>Attack</label>
								<input name={"config."+this.props.operator+".ampEnv.attackTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.attackTime}></input>
						</div>
						<div className="cp-fieldset__half-cell">
								<label>Decay</label>
								<input name={"config."+this.props.operator+".ampEnv.decayAmount"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.decayAmount}></input>
						</div>
						<div className="cp-fieldset__half-cell">
							<label>Sustain</label>
								<input name={"config."+this.props.operator+".ampEnv.sustainLevel"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.sustainLevel}></input>
						</div>
						<div className="cp-fieldset__half-cell">
							<label>Release</label>
							<input name={"config."+this.props.operator+".ampEnv.releaseTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.releaseTime}></input>
						</div>
				</fieldset>
				<fieldset className="cp-fieldset">
						<legend>Pitch Env</legend>
						<div className="cp-fieldset__half-cell">
							<label>Attack</label>
							<input name={"config."+this.props.operator+".pitchEnv.attackTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.attackTime}></input>
						</div>
						<div className="cp-fieldset__half-cell">
							<label>Decay</label>
							<input name={"config."+this.props.operator+".pitchEnv.decayAmount"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.decayAmount}></input>
						</div>
						<div className="cp-fieldset__half-cell">
							<label>Sustain</label>
							<input name={"config."+this.props.operator+".pitchEnv.sustainLevel"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.sustainLevel}></input>
						</div>
						<div className="cp-fieldset__half-cell">
							<label>Release</label>
							<input name={"config."+this.props.operator+".pitchEnv.releaseTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.releaseTime}></input>
						</div>
				</fieldset>
			</fieldset>
    );
  }
}

export default OperatorModule;