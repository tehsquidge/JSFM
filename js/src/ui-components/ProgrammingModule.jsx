import React from 'react';

class ProgrammingModule extends React.Component {
  render () {
    return (
        <fieldset class="programming column">
        <legend>Programming</legend>
        <fieldset>
            <legend>Operator Configuration</legend>
            <button id="presetApply">Apply</button>
            <button id="presetReset">Reset</button>
        </fieldset>
        <fieldset>
            <legend>Presets</legend>
            <input type="file" id="presetLoad"></input>
            <button id="presetSave">Save Preset</button>
        </fieldset>
        <fieldset>
            <legend>MIDI</legend>
            <select id="midiSelect">

            </select>
            <button id="midiApply">Apply</button>
            <button id="midiRefresh">Refresh</button>
        </fieldset>
        </fieldset>
    );
  }
}

export default ProgrammingModule;