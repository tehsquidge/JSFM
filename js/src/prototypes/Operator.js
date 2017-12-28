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
    
        this._env = { 'attackTime' : 0, 'decayAmount': 1, 'sustainLevel' : 1, 'releaseTime': 0 };
        
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
                this._output.gain.exponentialRampToValueAtTime(this._env.sustainLevel + this._env.decayAmount, now + this._env.attackTime);
                this._output.gain.linearRampToValueAtTime(this._env.sustainLevel, now + this._env.attackTime + this._env.decayAmount);            
            }else{
                this._output.gain.linearRampToValueAtTime((this._env.sustainLevel + this._env.decayAmount) * this._modulationFactor, now + this._env.attackTime);            
                this._output.gain.linearRampToValueAtTime(this._env.sustainLevel * this._modulationFactor, now + this._env.attackTime + this._env.decayAmount);            

            }

        }
    },
    gateOff: {
        value: function(){
            this._output.gain.cancelAndHoldAtTime(this._ac.currentTime);
            if(this._env.sustainLevel > 0){
                var endTime =  this._ac.currentTime + this._env.releaseTime;            
                this._output.gain.linearRampToValueAtTime(0.001, endTime);
            }else{
                var endTime = this._ac.currentTime;
            }
            this._output.gain.setValueAtTime(0,endTime );
        }
    }
});