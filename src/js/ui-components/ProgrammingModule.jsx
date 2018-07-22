import React from 'react';

class ProgrammingModule extends React.Component {
    
    render () {
        var MIDIOptions = [];
        if(this.props.MIDI.MIDIDevices instanceof MIDIInputMap){
            for(let [i,input] of this.props.MIDI.MIDIDevices.entries()) {
                const  selected = (this.props.MIDI.device == i)? true: false;
            MIDIOptions.push(<option key={i} value={i} selected={selected}>{input.name}</option>);
            }
        }
        return (
        <fieldset className="programming column">
            <legend>Programming</legend>
            <fieldset>
                <legend>Operator Configuration</legend>
                <button onClick={this.props.applyConfig} className={this.props.modifiedStatus.operators? 'attention' : ' '}>Apply</button>
                <button onClick={this.props.resetConfig}>Reset</button>
            </fieldset>
            <fieldset>
                <legend>Presets</legend>
                <input type="file"  onChange={this.props.loadPreset} onClick={(e)=> { e.target.value = null }}></input>
                <button onClick={this.props.saveConfig}>Save Preset</button>
            </fieldset>
            <fieldset>
                <legend>MIDI</legend>
                <select name="MIDI.device" onChange={this.props.stateChange}>
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