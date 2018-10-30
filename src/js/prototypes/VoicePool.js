import Voice from './Voice';

function VoicePool(ac) {

    this._ac = ac;

    this._voiceCount = 16;
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
    bend: {
        value: function(cent){
            for(var i = 0; i < this._voiceCount; i++){
                this._voices[i].bend(cent);
            }
        }
    },
    modWheel: {
        value: function(mod){
            for(var i = 0; i < this._voiceCount; i++){
                this._voices[i].modWheel(mod);
            }
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
                if(this._voices[i].configure(config) === false){
                    return false;
                }
            }
            return true;
        }
    }
});

export default VoicePool;