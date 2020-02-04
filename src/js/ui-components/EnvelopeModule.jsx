import React from 'react';
import ADSRVisualizer from './ADSRVisualizer.jsx';

export default class EnvelopeModule extends React.Component {

    render(){
        return (
            <fieldset className="cp-fieldset">
                <legend>{this.props.title}</legend>
                <div className="cp-fieldset__cell cp-fieldset__cell--half">
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Attack</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.attackTime`} type="number"  onChange={this.props.stateChange} value={this.props.attackTime} min="0" max="10" step="0.05"></input>
                    </div>
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Decay</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.decayAmount`} type="number"  onChange={this.props.stateChange} value={this.props.decayAmount} min="0" max="1" step="0.05"></input>
                    </div>
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Sustain</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.sustainLevel`} type="number"  onChange={this.props.stateChange} value={this.props.sustainLevel} min="0" max="30" step="0.05"></input>
                    </div>
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Release</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.releaseTime`} type="number"  onChange={this.props.stateChange} value={this.props.releaseTime} min="0" max="10" step="0.05"></input>
                    </div>
                </div>
                <div className="cp-fieldset__cell cp-fieldset__cell--half">
                    <ADSRVisualizer {...this.props}></ADSRVisualizer>
                </div>
            </fieldset>
        );
    }

}