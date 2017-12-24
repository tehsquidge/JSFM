var ac = new AudioContext();

function Analyser(ac){
    this._analyser = ac.createAnalyser();
    this._canvas = document.createElement('canvas');
    this._canvasCtx = this._canvas.getContext("2d");
    this._width = 300;
    this._height = 150;
    document.body.append(this._canvas);
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
                        
            this._canvasCtx.fillStyle = 'rgba(0, 20, 0, .9)';
            this._canvasCtx.fillRect(0, 0, this._width, this._height);
            
            this._canvasCtx.lineWidth = 1;
            this._canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
            this._canvasCtx.beginPath();
            var sliceWidth = this._width * 1 / 440;
            var x = 0;

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
        
              this._canvasCtx.lineTo(this._width, this._height);
              this._canvasCtx.stroke();  

        }
    },
    drawLoop: {
        value: function(){
            this.draw();
            requestAnimationFrame(this.drawLoop.bind(this));
        }
    }
});
function Operator(ac){

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
    
        this._env = { 'attackTime' : 0, 'sustainLevel' : 1, 'releaseTime': 0 };
        
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
            return this._osc.frequency.value / this._ratio;
        },
        set: function(freq) {
            this._osc.frequency.setValueAtTime(freq * this._ratio,this._ac.currentTime);
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
    envelope: {
        get: function() {
            return this._env;
        },
        set: function(env){
            this._env = env;
        }
    },
    gateOn: {
        value: function(){
            var now = this._ac.currentTime;
            this._output.gain.cancelScheduledValues(now);
            this._output.gain.value = 0.00001;
            if(this.mode == 'carrier'){
                this._output.gain.exponentialRampToValueAtTime(this._env.sustainLevel, now + this._env.attackTime);            
            }else{
                this._output.gain.linearRampToValueAtTime(this._env.sustainLevel * this._modulationFactor, now + this._env.attackTime);            
            }

        }
    },
    gateOff: {
        value: function(){
            this._output.gain.cancelAndHoldAtTime(this._ac.currentTime);
            var endTime = this._ac.currentTime + this._env.releaseTime;            
            this._output.gain.linearRampToValueAtTime(0.001, endTime);
            this._output.gain.setValueAtTime(0,endTime );
        }
    }
});
function Voice(ac) {
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
                op.envelope = params[opKey].envelope;
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
});
function VoicePool(ac) {

    this._ac = ac;

    this._voiceCount = 8;
    this._voices = [];
    this._voicesFrequencies = [];
    this._voiceCycleIdx = 0;
    
    this._output = this._ac.createGain();
    
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

var voicePool = new VoicePool(ac);
var analyser = new Analyser(ac);

voicePool.output.connect(analyser.analyser);

analyser.connect(ac.destination);

analyser.drawLoop();

//controls

var applyConfig = function(){
    var configuration = {};
    document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
        configuration[opConf.dataset.operator] = {
            'connectsTo': opConf.querySelector('.connectsTo').value,
            'waveType': opConf.querySelector('.waveType').value,
            'ratio': parseFloat(opConf.querySelector('.ratio').value),
            'detune': parseFloat(opConf.querySelector('.detune').value),
            'modulationFactor': parseFloat(opConf.querySelector('.modulationFactor').value),
            'envelope': {
                'attackTime': parseFloat(opConf.querySelector('.attackTime').value),
                'sustainLevel': parseFloat(opConf.querySelector('.sustainLevel').value),
                'releaseTime': parseFloat(opConf.querySelector('.releaseTime').value)
            }        
        }
    });
    voicePool.configure(configuration);
}
applyConfig();
document.querySelector('#apply').addEventListener('click',function(e){ e.preventDefault(); applyConfig();  });
document.querySelector('#gateOn').addEventListener('click',function(e){ e.preventDefault(); voicePool.keyDown(440);  });
document.querySelector('#gateOff').addEventListener('click',function(e){ e.preventDefault(); voicePool.keyUp(440);  });
