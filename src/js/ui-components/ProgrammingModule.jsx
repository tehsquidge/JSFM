import React from 'react';

class ProgrammingModule extends React.Component {
    
    render () {
        const MIDIOptions = [];
        for(let prop in this.props.MIDI.otherDevices) {
            MIDIOptions.push(<option key={prop} value={prop}>{prop}</option>);
        }
        if(typeof MIDIInputMap != 'undefined' && this.props.MIDI.MIDIDevices instanceof MIDIInputMap){
            for(let [i,input] of this.props.MIDI.MIDIDevices.entries()) {
                MIDIOptions.push(<option key={i} value={i}>{input.name}</option>);
            }
        }
        return (
        <fieldset className="cp-fieldset cp-fieldset--column">
            <legend>Programming</legend>
            <fieldset className="cp-fieldset">
                <legend>Operator Configuration</legend>
                <button onClick={this.props.applyConfig} className={this.props.modifiedStatus.operators? 'attention' : ' '}>Apply</button>
                <button onClick={this.props.resetConfig}>Reset</button>
            </fieldset>
            <fieldset className="cp-fieldset">
                <legend>Presets</legend>
                <input type="file"  onChange={this.props.loadPreset} onClick={(e)=> { e.target.value = null }}></input>
                <button onClick={this.props.saveConfig}>Save Preset</button>
            </fieldset>
            <fieldset className="cp-fieldset">
                <legend>MIDI</legend>
                <select name="MIDI.device" value={this.props.MIDI.device} onChange={this.props.stateChange}>
                {MIDIOptions}
                </select>
                <button className={this.props.modifiedStatus.MIDI? 'attention' : ' '} onClick={this.props.applyMIDI}>Apply</button>
                <button onClick={this.props.buildMIDIDeviceList}>Refresh</button>
            </fieldset>
        </fieldset>
        );
    }
}

export default ProgrammingModule;