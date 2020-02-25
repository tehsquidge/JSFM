import React from 'react';
import ADSRVisualizer from './ADSRVisualizer';
import { EnvelopeInterface } from '../types/Preset.js';

export interface EnvelopeModulePropsInterface extends EnvelopeInterface {
    open?: boolean;
    title: string;
    operator: string;
    type: string;
    modifierProps: {
        label: string;
        min: number;
        max: number;
        step: number;
        type: string;
    };
}

export interface EnvelopeModuleStateInterface {
    open: boolean;
}

export default class EnvelopeModule extends React.Component<EnvelopeModulePropsInterface,EnvelopeModuleStateInterface> {

    constructor(props){
        super(props);
        this.state = {
            'open': true
        }
    }

    componentDidMount(){
        if(typeof this.props.open === "boolean")
            this.open = this.props.open;
    }

    set open(isOpen){
        this.setState( state => {
            return { 'open': !!isOpen }
        })
    }

    get open(){
        return this.state.open;
    }

    toggleOpen(){
        this.open = !this.open;
    }

    render(){
        return (
            <fieldset className={`cp-fieldset ${ this.open? "" : "cp-fieldset--hidden" } `}>
                <legend>{this.props.title} <button className="cp-fieldset__hide-button" onClick={this.toggleOpen.bind(this)}>[{ this.open? "hide" : "show" }]</button></legend>
                <div className="cp-fieldset__cell cp-fieldset__cell--half">
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Attack</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.attackTime`} type="number"  onChange={this.props.stateChange} value={this.props.attackTime} min="0" max="10" step="0.05"></input>
                    </div>
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Decay</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.decayTime`} type="number"  onChange={this.props.stateChange} value={this.props.decayTime} min="0" max="10" step="0.05"></input>
                    </div>
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Sustain</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.sustainLevel`} type="number"  onChange={this.props.stateChange} value={this.props.sustainLevel} min="0" max="1" step="0.05"></input>
                    </div>
                    <div className="cp-fieldset__cell cp-fieldset__cell--half">
                        <label>Release</label>
                        <input name={`config.${this.props.operator}.${this.props.type}.releaseTime`} type="number"  onChange={this.props.stateChange} value={this.props.releaseTime} min="0" max="10" step="0.05"></input>
                    </div>
                </div>
                <div className="cp-fieldset__cell cp-fieldset__cell--half">
                    <ADSRVisualizer {...this.props}></ADSRVisualizer>
                </div>
                <div className="cp-fieldset__cell">
                    <label>{this.props.modifierProps.label}</label>
                    <input title={this.props.modifierProps.label + ": " + this.props.modifier} name={`config.${this.props.operator}.${this.props.type}.modifier`} onChange={this.props.stateChange} value={this.props.modifier}
                    {...this.props.modifierProps}/>
                    
                </div>
            </fieldset>
        );
    }

}