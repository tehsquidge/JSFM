var ac = new AudioContext();

var MidiDevices = null;
var midiController = null;
var defaultPreset = {
    "a": {
        "connectsTo": "output",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    },
    "b": {
        "connectsTo": "none",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    },
    "c": {
        "connectsTo": "none",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    },
    "d": {
        "connectsTo": "none",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    }
};

var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};function Analyser(ac){
    this._analyser = ac.createAnalyser();
    this._analyser.fftSize = 512;
    this._canvas = document.createElement('canvas');
    this._canvasCtx = this._canvas.getContext("2d");
    this._width = 200;
    this._height = 200;
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    document.body.querySelector('.analyser').append(this._canvas);
}

Analyser.prototype = Object.create(null,{
    constructor: {
        value: Analyser
    },
    analyser: {
        get: function(){
            return this._analyser;
        }
    },
    connect: {
        value: function(a){
            this.disconnect();
            this._analyser.connect(a);
        }
    },
    disconnect: {
        value: function(){
            this._analyser.disconnect();
        }
    },
    draw: {
        value: function(){
            var bufferLength = this._analyser.fftSize;

            var dataArray = new Uint8Array(bufferLength);

            this._analyser.getByteTimeDomainData(dataArray);
                        
            this._canvasCtx.fillStyle = 'rgba(0, 20, 0, .4)';
            this._canvasCtx.fillRect(0, 0, this._width, this._height);
            
            this._canvasCtx.lineWidth = 1;
            this._canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
            this._canvasCtx.beginPath();
            var sliceWidth = (this._width * 1.0  / bufferLength);
            var x =1;

            for(var i = 0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * this._height/2;
        
                if(i === 0) {
                  this._canvasCtx.moveTo(x, y);
                } else {
                  this._canvasCtx.lineTo(x, y);
                }
        
                x += sliceWidth;
            }
        
              this._canvasCtx.lineTo(this._width+1, this._height+1);
              this._canvasCtx.stroke();  

        }
    },
    drawLoop: {
        value: function(){
            this.draw();
            requestAnimationFrame(this.drawLoop.bind(this));
        }
    }
});function Operator(ac){

        this._ac = ac;
    
        this._osc = ac.createOscillator();
        this._osc.frequency.value = 220;
    
        this._output = ac.createGain();
        this._output.gain.value = 0;
    
    
        this._osc.connect(this._output);
        
        this._osc.start();

        this._ratio = 1;
        this._modulationFactor = 1;
        this._mode = "carrier"; //can be carrier or modulator
    
        this._ampEnv = { 'attackTime' : 0, 'decayAmount': 1, 'sustainLevel' : 1, 'releaseTime': 0 };
        this._pitchEnv = { 'attackTime' : 0, 'decayAmount': 0, 'sustainLevel' : 1, 'releaseTime': 0 };
        
    }
    
Operator.prototype = Object.create(null,{
    constructor: { 
        value: Operator
    },
    connect: {
        value: function(a) {
            this.disconnect();
            this._output.connect(a);
        }
    },
    disconnect: {
        value: function() {
            this._output.disconnect();            
        }
    },
    reset: {
        value: function(){
            this.disconnect();
            this.ratio = 1;
            this.modulationFactor = 1;
        }
    },
    waveType: {
        set: function(wf){
            this._osc.type = wf;
        },
        get: function(){
            return this._osc.type;
        }
    },
    mode: {
        get: function(){
            return this._mode;
        },
        set:  function(val){
            if(val == 'carrier' || val == 'modulator'){
                this._mode = val;
            }else{
                console.log('invalid operator mode');
            }
        }
    },
    modulationFactor: {
        get: function() {
            return this._modulationFactor;
        },
        set: function(val) {
            this._modulationFactor = val;
        }
    },
    frequency: {
        get: function() {
            return this._frequency / this._ratio;
        },
        set: function(freq) {
            this._frequency = freq * this._ratio;
            this._osc.frequency.setValueAtTime(this._frequency, this._ac.currentTime);
        }
    },
    ratio: {
        get: function() {
            return this._ratio;
        },
        set: function(ratio) {
            var originalFreq = this.frequency;
            this._ratio = ratio;
            this.frequency = originalFreq;
        }
    },
    detune: {
        get: function() {
            return this._osc.detune.value; 
        },
        set: function(d) {
            this._osc.detune.value = d;
        }
    },
    ampEnv: {
        get: function() {
            return this._ampEnv;
        },
        set: function(env){
            this._ampEnv = env;
        }
    },
    pitchEnv: {
        get: function() {
            return this._pitchEnv;
        },
        set: function(env){
            this._pitchEnv = env;
        }
    },
    gateOn: {
        value: function(){
            var now = this._ac.currentTime;

            this._output.gain.cancelScheduledValues(now);
            this._output.gain.value = 0.00001;

            this._osc.frequency.cancelScheduledValues(now);
            this._osc.frequency.setValueAtTime(this.frequency*this.ratio, this._ac.currentTime);
            this._osc.frequency.linearRampToValueAtTime(( (this.frequency * this.ratio) * (this._pitchEnv.sustainLevel + this._pitchEnv.decayAmount)), now + this._pitchEnv.attackTime);
            this._osc.frequency.linearRampToValueAtTime(((this.frequency * this.ratio) * this._pitchEnv.sustainLevel), now + this._pitchEnv.attackTime + this._pitchEnv.decayAmount);      

            if(this.mode == 'carrier'){
                this._output.gain.linearRampToValueAtTime(this._ampEnv.sustainLevel + this._ampEnv.decayAmount, now + this._ampEnv.attackTime);
                this._output.gain.linearRampToValueAtTime(this._ampEnv.sustainLevel, now + this._ampEnv.attackTime + this._ampEnv.decayAmount);            
            }else{
                this._output.gain.linearRampToValueAtTime((this._ampEnv.sustainLevel + this._ampEnv.decayAmount) * this._modulationFactor, now + this._ampEnv.attackTime);            
                this._output.gain.linearRampToValueAtTime(this._ampEnv.sustainLevel * this._modulationFactor, now + this._ampEnv.attackTime + this._ampEnv.decayAmount);            
            }

        }
    },
    gateOff: {
        value: function(){
            if(this._osc.frequency.cancelAndHoldAtTime){ this._osc.frequency.cancelAndHoldAtTime(this._ac.currentTime); }
            if(this._output.gain.cancelAndHoldAtTime){ this._output.gain.cancelAndHoldAtTime(this._ac.currentTime); }

            if(this._ampEnv.sustainLevel > 0){
                var endTime =  this._ac.currentTime + this._ampEnv.releaseTime;            
                this._output.gain.linearRampToValueAtTime(0.001, endTime);
            }else{
                var endTime = this._ac.currentTime;
            }
            this._output.gain.setValueAtTime(0,endTime );

            if(this._pitchEnv.sustainLevel != 1){
                var endTime =  this._ac.currentTime + this._pitchEnv.releaseTime;            
                this._osc.frequency.linearRampToValueAtTime(this.frequency *this.ratio, endTime);
                this._osc.frequency.setValueAtTime(this.frequency *this.ratio,endTime );
            }

        }
    },
    silence: {
        value: function() {
            this._output.gain.setValueAtTime(0, this._ac.currentTime );
        }
    }
});function Reverb(ac){
    this._ac = ac;

    this._convolver = this._ac.createConvolver();

    this._output = this._ac.createGain();
    this._input = this._ac.createGain();
    this._wet = this._ac.createGain();
    this._dry = this._ac.createGain();

    this._input.connect(this._convolver);
    this._input.connect(this._dry);

    this._convolver.connect(this._wet);

    this._wet.connect(this._output);
    this._dry.connect(this._output);

    this._seconds = 1;
    this._decay = 1;
    this._reverse = false;
    this._constructReverb();
}

Reverb.prototype = Object.create(null, {
    constructor: {
        value: Reverb
    },
    connect: {
        value: function(a){
            this.disconnect();
            this._output.connect(a);
        }
    },
    disconnect: {
        value: function(){
            this._output.disconnect();
        }
    },
    convolver: {
        get: function(){
            return this._input;
        }
    },
    _constructReverb: {
        value: function(){
            var rate = this._ac.sampleRate,
            length = rate * this._seconds,
            impulse = this._ac.createBuffer(2, length, rate),
            impulseL = impulse.getChannelData(0),
            impulseR = impulse.getChannelData(1),
            n, i;

            for(i = 0; i < length; i++){
                n = this._reverse ? length - i : i;
                impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
                impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
            }

            this._convolver.buffer = impulse;
        }
    },
    seconds: {
        get: function(){
            return this._seconds;
        },
        set: function(s){
            this._seconds = s;
            this._constructReverb();
        }
    },
    decay: {
        get: function(){
            return this._decay;
        },
        set: function(d){
            this._decay = d;
            this._constructReverb();
        }
    },
    reverse: {
        get: function(){
            return this._reverse;
        },
        set: function(r){
            this._reverse = r;
            this._constructReverb();
        }
    },
    wet:{
        get: function(){
            return this._wet.gain.value;
        },
        set: function(a){
            this._wet.gain.value = a;
            this._constructReverb();
        }
    },
    dry:{
        get: function(){
            return this._dry.gain.value;
        },
        set: function(a){
            this._dry.gain.value = a;
            this._constructReverb();
        }
    },
    configure: {
        value: function(params){
            this._seconds = params.seconds;
            this._decay = params.decay;
            this._reverse = params.reverse;
            this._wet.gain.value = params.wet;
            this._dry.gain.value = params.dry;
            this._constructReverb();
        }
    }
});function Voice(ac) {
    this._ac = ac;

    this._output = ac.createGain();

    this._operators = {};
    this._operators.a = new Operator(ac);
    this._operators.b = new Operator(ac);
    this._operators.c = new Operator(ac);
    this._operators.d = new Operator(ac);

    this.frequency = 440;

}


Voice.prototype = Object.create(null, {
    constructor: {
        value: Voice
    },
    reset: {
        value: function () {
            for (var key in this._operators) {
                this._operators[key].reset();
            }
        }
    },
    configure: {
        value: function (params) {
            for(var opKey in params){
                var op = this._operators[opKey];
                op.silence(); //kill sound to stop horrible noises which can occur when switching from high-gain-modulation to output.

                switch(params[opKey].connectsTo){
                    case 'none':
                        op.disconnect();
                        return;
                    break;
                    case 'output':
                        op.connect(this._output);
                        op.mode = 'carrier';
                    break;
                    case 'a':
                    case 'b':
                    case 'c':
                    case 'd':
                        op.connect(this._operators[params[opKey].connectsTo]._osc.frequency);
                        op.mode = 'modulator';
                    break;
                }
                op.waveType = params[opKey].waveType;
                op.modulationFactor = params[opKey].modulationFactor;
                op.ratio = params[opKey].ratio;
                op.detune = params[opKey].detune;
                op.ampEnv = params[opKey].ampEnv;
                op.pitchEnv = params[opKey].pitchEnv;
            }
        }
    },
    frequency: {
        get: function(){
            return this._frequency;
        },
        set: function(newFreq){
            this._frequency = newFreq;
            for (var key in this._operators) {
                this._operators[key].frequency = newFreq;
            }
        }
    },
    output: {
        get: function () {
            return this._output;
        }
    },
    gateOn: {
        value: function () {
            for (var key in this._operators) {
                if (this._operators.hasOwnProperty(key)) {
                    this._operators[key].gateOn();
                }
            }
        }
    },
    gateOff: {
        value: function () {
            for (var key in this._operators) {
                if (this._operators.hasOwnProperty(key)) {
                    this._operators[key].gateOff();
                }
            }
        }
    }
});function VoicePool(ac) {

    this._ac = ac;

    this._voiceCount = 32;
    this._voices = [];
    this._voicesFrequencies = [];
    this._voiceCycleIdx = 0;
    
    this._output = this._ac.createGain();
    this._output.gain.value = .5;
    
    for(var i = 0; i < this._voiceCount; i++){
        this._voices[i] = new Voice(this._ac);
        this._voices[i].output.connect(this._output);

        this._voices[i].frequency = 440;
        this._voicesFrequencies[i] = 0;
    }
}

VoicePool.prototype = Object.create(null,{
    constructor: {
        value: VoicePool
    },
    getFreeVoice: {
        value: function(freq){
            //is the freq already playing
            for(var i = 0; i < this._voiceCount; i++){
                if(this._voicesFrequencies[i] == freq){
                    v = i;
                    return v; //note already playing on a voice so return that
                }
            }
            var v = this._voiceCycleIdx; //if we can't find a free voice we'll use the first
            for(var i = 0; i < this._voiceCount; i++){
                var idx = this._voiceCycleIdx + i;
                if(idx == this._voiceCount){
                    idx -= this._voiceCycleIdx;
                }
                if(this._voicesFrequencies[idx] == 0){ //if the voice is free (note: that this is the assigned frequency not the one actually sounding. If it's "assigned" 0 freq then it's been released although it may still be playing a sound)
                    v = idx;
                    break;
                }
            }
            this._voiceCycleIdx++;
            if(this._voiceCycleIdx == this._voiceCount)
                this._voiceCycleIdx = 0;
            this._voicesFrequencies[v] = freq;
            return v;
        },
        enumerable: false, //hide from devs
        writable: false, //readonly
        configurable: false //can not change above
    },
    releaseVoice: {
        value: function(freq){
            for(var i = 0; i < this._voiceCount; i++){
                if(this._voicesFrequencies[i] == freq){ //if the voice is playing a released freq
                    this._voicesFrequencies[i] = 0;
                    this._voices[i].gateOff();
                }
            }
        },
        enumerable: false, //hide from devs
        writable: false, //readonly
        configurable: false //can not change above
    },
    keyDown: {
        value: function(freq){
                var voiceIdx = this.getFreeVoice(freq);
                this._voices[voiceIdx].frequency = freq;
                this._voices[voiceIdx].gateOn();
                return this._voices[voiceIdx];
        }
    },
    keyUp: {
        value: function(freq){
                var voiceIdx = this.releaseVoice(freq);
        }
    },
    voices: {
        value: function(){
            return this._voices;
        }
    },
    output: {
        get: function(){
            return this._output;
        }
    },
    configure: {
        value: function(config){
            for(var i = 0; i < this._voiceCount; i++){
                this._voices[i].configure(config);
            }
        }
    }
});
function MidiInputDevice(voicePool){
    this._input = null;
    this._output = null;
    this._voicePool = voicePool;
}

MidiInputDevice.prototype = Object.create(Object,{
    constructor:{
        value: MidiInputDevice
    },
    onMIDIMessage: {
        value: function(message) {
            var freq = 440 * Math.pow(2, (message.data[1] - 69) / 12);
            switch(message.data[0]){
                case 144:
                this._voicePool.keyDown(freq);
                    break;
                case 128:
                this._voicePool.keyUp(freq);
                    break;
            }

        }
    },
    input: {
        get: function(){
            return this._input;
        },
        set: function(i){
            this._input = i;
            var self = this;
            this._input.onmidimessage = function(m){ self.onMIDIMessage(m); }
        }
    },
    output: {
        get: function(){
            return this._output;
        },
        set: function(i){
            this._output = i;
        }
    }
});
var voicePool = new VoicePool(ac);
var analyser = new Analyser(ac);
var reverb = new Reverb(ac);


domReady(function() {

    voicePool.output.connect(analyser.analyser);

    analyser.connect(reverb.convolver);

    reverb.connect(ac.destination);

    analyser.drawLoop();

    //midi
    midiController = new MidiInputDevice(voicePool);

    var midiRefresh = function(){
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(
                function(midi){ //success
                    console.log('Got midi!', midi);
                    MidiDevices = midi.inputs;
                    var selectMIDI = document.querySelector('#midiSelect');
                    while (selectMIDI.options.length > 0) {                
                        selectMIDI.remove(0);
                    } 
                    for(let [i,input] of MidiDevices.entries()) {
                            var option = document.createElement("option");
                            option.text = input.name;
                            option.value = i;
                            selectMIDI.appendChild(option);
                    }
                    midiApply();
                },
                function(){ //failure
                    console.log('could not get midi devices');
                }
            );
        }else{
            console.log('no MIDI support');
        }
    }
    midiRefresh();

    var midiApply = function() {
        var deviceID = document.querySelector('#midiSelect').value;
        midiController.input = MidiDevices.get(deviceID);
    }
    
    //controls

    var getConfig = function(){
        var configuration = {};
        document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
            configuration[opConf.dataset.operator] = {
                'connectsTo': opConf.querySelector('.connectsTo').value,
                'waveType': opConf.querySelector('.waveType').value,
                'ratio': parseFloat(opConf.querySelector('.ratio').value),
                'detune': parseFloat(opConf.querySelector('.detune').value),
                'modulationFactor': parseFloat(opConf.querySelector('.modulationFactor').value),
                'ampEnv': {
                    'attackTime': parseFloat(opConf.querySelector('.ampEnv .attackTime').value),
                    'decayAmount': parseFloat(opConf.querySelector('.ampEnv .decayAmount').value),
                    'sustainLevel': parseFloat(opConf.querySelector('.ampEnv .sustainLevel').value),
                    'releaseTime': parseFloat(opConf.querySelector('.ampEnv .releaseTime').value)
                },
                'pitchEnv': {
                    'attackTime': parseFloat(opConf.querySelector('.pitchEnv .attackTime').value),
                    'decayAmount': parseFloat(opConf.querySelector('.pitchEnv .decayAmount').value),
                    'sustainLevel': parseFloat(opConf.querySelector('.pitchEnv .sustainLevel').value),
                    'releaseTime': parseFloat(opConf.querySelector('.pitchEnv .releaseTime').value)
                }        
            }
        });
        return configuration;
    }

    var presetApply = function(config){
        voicePool.configure(config);
    }
    presetApply(getConfig());

    var presetReset = function(config){
        document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
            opConf.querySelector('.connectsTo option[value='+config[opConf.dataset.operator].connectsTo+']').selected = true;
            opConf.querySelector('.waveType').value = config[opConf.dataset.operator].waveType;
            opConf.querySelector('.ratio').value = config[opConf.dataset.operator].ratio;
            opConf.querySelector('.detune').value = config[opConf.dataset.operator].detune;
            opConf.querySelector('.modulationFactor').value = config[opConf.dataset.operator].modulationFactor;
            opConf.querySelector('.ampEnv .attackTime').value = config[opConf.dataset.operator].ampEnv.attackTime;
            opConf.querySelector('.ampEnv .decayAmount').value = config[opConf.dataset.operator].ampEnv.decayAmount;
            opConf.querySelector('.ampEnv .sustainLevel').value = config[opConf.dataset.operator].ampEnv.sustainLevel;
            opConf.querySelector('.pitchEnv .releaseTime').value = config[opConf.dataset.operator].ampEnv.releaseTime;
            opConf.querySelector('.pitchEnv .attackTime').value = config[opConf.dataset.operator].pitchEnv.attackTime;
            opConf.querySelector('.pitchEnv .decayAmount').value = config[opConf.dataset.operator].pitchEnv.decayAmount;
            opConf.querySelector('.pitchEnv .sustainLevel').value = config[opConf.dataset.operator].pitchEnv.sustainLevel;
            opConf.querySelector('.pitchEnv .releaseTime').value = config[opConf.dataset.operator].pitchEnv.releaseTime;
        });
    }
    presetReset(defaultPreset);

    var saveConfig = function(){
        var data = getConfig();    
        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }
    
        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
    
        a.download = 'preset.json'
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)  
    }

    var loadPreset = function(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var config = JSON.parse(e.target.result);
            presetReset(config);
        };
        reader.readAsText(file);
      }

    var applyReverbConfig = function(){
        var reb = document.querySelector('#controller fieldset.reverb');
        reverb.configure({
            'wet':  parseFloat(reb.querySelector('.wet').value),
            'dry':  parseFloat(reb.querySelector('.dry').value),
            'seconds':  parseFloat(reb.querySelector('.seconds').value),
            'decay':  parseFloat(reb.querySelector('.decay').value),
            'reverse':  parseInt(reb.querySelector('.reverse').value)
        });
    }
    applyReverbConfig();

    document.querySelector('#presetApply').addEventListener('click',function(e){ e.preventDefault(); presetApply(getConfig());  });
    document.querySelector('#presetReset').addEventListener('click',function(e){ e.preventDefault(); presetReset(defaultPreset); });
    document.querySelector('#presetLoad').addEventListener('change',loadPreset );
    document.querySelector('#presetSave').addEventListener('click',function(e){ e.preventDefault(); saveConfig();  });

    document.querySelector('#midiApply').addEventListener('click',function(e){ e.preventDefault(); midiApply(); });
    document.querySelector('#midiRefresh').addEventListener('click',function(e){ e.preventDefault(); midiRefresh(); });

    document.querySelector('#reverbApply').addEventListener('click',function(e){ e.preventDefault(); applyReverbConfig(); });




});