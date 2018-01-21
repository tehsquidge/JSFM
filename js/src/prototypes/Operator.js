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
            this._osc.frequency.setValueAtTime(this.frequency*this._ratio, this._ac.currentTime);
            this._osc.frequency.linearRampToValueAtTime(( (this.frequency * this.ratio) * (this._pitchEnv.sustainLevel + this._pitchEnv.decayAmount)), now + this._pitchEnv.attackTime);
            this._osc.frequency.linearRampToValueAtTime((this.frequency * this._pitchEnv.sustainLevel), now + this._pitchEnv.attackTime + this._pitchEnv.decayAmount);      

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
});