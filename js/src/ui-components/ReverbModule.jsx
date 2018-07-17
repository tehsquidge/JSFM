import React from 'react';

class ReverbModule extends React.Component {
  render () {
    return (<fieldset class="reverb">
<legend>Reverb</legend>
<div>
    <label>
        Wet
        <input class="wet" type="range" value="0" min="0" step=".01" max="1"></input>
    </label>
    <label>
        Dry
        <input class="dry" type="range" value="1" min="0" step=".01" max="1"></input>
    </label>
</div>
<div>
    <label>
        Seconds
        <input class="seconds" type="range" value="1" min="0" step=".01" max="10"></input>
    </label>
    <label>
        Decay
        <input class="decay" type="range" value="1" min="0" step=".01" max="10"></input>
    </label>
</div>
<label>
    Reverse
    <select class="reverse" >
        <option value="1">On</option>
        <option value="0" selected>Off</option>
    </select>
</label>
<button id="reverbApply">Apply</button>
</fieldset>
    );
}
}

export default ReverbModule;