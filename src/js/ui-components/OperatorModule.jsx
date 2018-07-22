import React from 'react';

class OperatorModule extends React.Component {

  render () {
    return (
<fieldset className="operator" data-operator={this.props.operator}>
				<legend>Operator {this.props.operator}</legend>
				<label>
					To
					<select name={"config."+this.props.operator+".connectsTo"}  onChange={this.props.stateChange} value={this.props.config.connectsTo}>
						<option value="none">None</option>
						<option value="output">Output</option>
                        {this.props.operators.map( function(op){ if(op != this.props.operator){ return <option key={op} value={op}>{op.toString().toUpperCase()}</option>  }  }.bind(this) )}
					</select>
				</label>
				<label>
						Wave Type
						<select name={"config."+this.props.operator+".waveType"}  onChange={this.props.stateChange} value={this.props.config.waveType}> 
							<option value="sine">Sine</option>
							<option value="square">Square</option>
							<option value="sawtooth">Sawtooth</option>
							<option value="triangle">Triangle</option>
						</select>
				</label>
				<label>
						Ratio
						<input name={"config."+this.props.operator+".ratio"} type="number" onChange={this.props.stateChange} value={this.props.config.ratio}></input>
				</label>
				<label>
						Detune
						<input name={"config."+this.props.operator+".detune"} type="number"  onChange={this.props.stateChange} value={this.props.config.detune}></input>
				</label>
				<label>
						modulation Factor
						<input name={"config."+this.props.operator+".modulationFactor"} type="number"  onChange={this.props.stateChange} value={this.props.config.modulationFactor}></input>
				</label>
				<fieldset>
						<legend>Amp Env</legend>
						<label>
								Attack
								<input name={"config."+this.props.operator+".ampEnv.attackTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.attackTime}></input>
						</label>
						<label>
								Decay
								<input name={"config."+this.props.operator+".ampEnv.decayAmount"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.decayAmount}></input>
						</label>
						<label>
								Sustain
								<input name={"config."+this.props.operator+".ampEnv.sustainLevel"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.sustainLevel}></input>
						</label>
						<label>
								Release
								<input name={"config."+this.props.operator+".ampEnv.releaseTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.ampEnv.releaseTime}></input>
						</label>
				</fieldset>
				<fieldset>
						<legend>Pitch Env</legend>
						<label>
								Attack
								<input name={"config."+this.props.operator+".pitchEnv.attackTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.attackTime}></input>
						</label>
						<label>
							Decay
							<input name={"config."+this.props.operator+".pitchEnv.decayAmount"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.decayAmount}></input>
						</label>
						<label>
								Sustain
								<input name={"config."+this.props.operator+".pitchEnv.sustainLevel"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.sustainLevel}></input>
						</label>
						<label>
								Release
								<input name={"config."+this.props.operator+".pitchEnv.releaseTime"} type="number"  onChange={this.props.stateChange} value={this.props.config.pitchEnv.releaseTime}></input>
						</label>
				</fieldset>
			</fieldset>
    );
  }
}

export default OperatorModule;