import React from 'react';

class OperatorModule extends React.Component {
  render () {
    return (
<fieldset className="operator" data-operator={this.props.operator}>
				<legend>Operator {this.props.operator}</legend>
				<label>
					To
					<select class="connectsTo">
						<option value="none">None</option>
						<option value="output">Output</option>
                        {this.props.operators.map( function(op){ if(op != this.props.operator){ return <option value={op.toString().toLowerCase()}>{op}</option>  }  }.bind(this) )}
					</select>
				</label>
				<label>
						Wave Type
						<select class="waveType">
							<option value="sine">Sine</option>
							<option value="square">Square</option>
							<option value="sawtooth">Sawtooth</option>
							<option value="triangle">Triangle</option>
						</select>
				</label>
				<label>
						Ratio
						<input class="ratio" type="number" value="1"></input>
				</label>
				<label>
						Detune
						<input class="detune" type="number" value="0"></input>
				</label>
				<label>
						modulation Factor
						<input class="modulationFactor" type="number" value="400"></input>
				</label>
				<fieldset class="ampEnv">
						<legend>Amp Env</legend>
						<label>
								Attack
								<input class="attackTime" type="number" value=".25"></input>
						</label>
						<label>
							Decay
							<input class="decayAmount" type="number" value=".15" max="1"></input>
						</label>
						<label>
								Sustain
								<input class="sustainLevel" type="number" value=".25" max="1"></input>
						</label>
						<label>
								Release
								<input class="releaseTime" type="number" value="1"></input>
						</label>
				</fieldset>
				<fieldset class="pitchEnv">
						<legend>Pitch Env</legend>
						<label>
								Attack
								<input class="attackTime" type="number" value="0"></input>
						</label>
						<label>
							Decay
							<input class="decayAmount" type="number" value="0" max="1"></input>
						</label>
						<label>
								Sustain
								<input class="sustainLevel" type="number" value="1"></input>
						</label>
						<label>
								Release
								<input class="releaseTime" type="number" value="0"></input>
						</label>
				</fieldset>
			</fieldset>
    );
  }
}

export default OperatorModule;