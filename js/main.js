var ac = new AudioContext();

function Analyser(ac){
    this._analyser = ac.createAnalyser();
    this._canvas = document.createElement('canvas');
    this._canvasCtx = this._canvas.getContext("2d");
    this._width = 100;
    this._height = 100;
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
            var timeData = new Uint8Array(this._analyser.frequencyBinCount);
            var scaling = this._height / 256;
            var risingEdge = 0;
            var edgeThreshold = 5;
            
            this._analyser.getByteTimeDomainData(timeData);
            
            this._canvasCtx.fillStyle = 'rgba(0, 20, 0, .25)';
            this._canvasCtx.fillRect(0, 0, this._width, this._height);
            
            this._canvasCtx.lineWidth = 1;
            this._canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
            this._canvasCtx.beginPath();
            
            // No buffer overrun protection
            while (timeData[risingEdge++] - 128 > 0 && risingEdge <= this._width)
                if (risingEdge >= this._width) risingEdge = 0;
            
            while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= this._width)
                if (risingEdge >= this._width) risingEdge = 0;
            
            for (var x = risingEdge; x < timeData.length && x - risingEdge < this._width; x++)
                this._canvasCtx.lineTo(x - risingEdge, this._height - timeData[x] * scaling);
            
            this._canvasCtx.stroke();
        }
    },
    drawLoop: {
        value: function(){
            this._draw();
            requestAnimationFrame(this._drawLoop);
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
                op.modulationFactor = params[opKey].modulationFactor;
                op.ratio = params[opKey].ratio;
                op.detune = params[opKey].detune;
                op.envelope = params[opKey].envelope;
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
var voice = new Voice(ac);

voice.output.connect(ac.destination);

//controls

var applyConfig = function(){
    var configuration = {};
    document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
        configuration[opConf.dataset.operator] = {
            'connectsTo': opConf.querySelector('.connectsTo').value,
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
    voice.configure(configuration);
}
applyConfig();
document.querySelector('#apply').addEventListener('click',function(e){ applyConfig(); e.preventDefault() });
document.querySelector('#gateOn').addEventListener('click',function(e){ voice.gateOn(); e.preventDefault() });
document.querySelector('#gateOff').addEventListener('click',function(e){ voice.gateOff(); e.preventDefault() });
