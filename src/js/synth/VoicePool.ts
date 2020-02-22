import {TheRootSchema as PresetInterface} from '../types/Preset';
import Voice from './Voice';

class VoicePool{
    private _ac: AudioContext;
    private _voiceCount: number;
    private _voices: Voice[];
    private _voicesFrequencies: number[];
    private _voiceCycleIdx: number;
    private _output: GainNode;
    
    constructor(ac: AudioContext) {
        this._ac = ac;

        this._voiceCount = 16;
        this._voices = [];
        this._voicesFrequencies = [];
        this._voiceCycleIdx = 0;
        
        this._output = this._ac.createGain();
        this._output.gain.value = .5;
        
        for(let i = 0; i < this._voiceCount; i++){
            this._voices[i] = new Voice(this._ac);
            this._voices[i].output.connect(this._output);

            this._voices[i].frequency = 440;
            this._voicesFrequencies[i] = 0;
        }
    }

    getFreeVoice(freq: number){
        //is the freq already playing
        for(let i = 0; i < this._voiceCount; i++){
            if(this._voicesFrequencies[i] === freq){
                return i; //note already playing on a voice so return that
            }
        }
        let v = this._voiceCycleIdx; //if we can't find a free voice we'll use the first
        for(let i = 0; i < this._voiceCount; i++){
            let idx = this._voiceCycleIdx + i;
            if(idx === this._voiceCount){
                idx -= this._voiceCycleIdx;
            }
            if(this._voicesFrequencies[idx] === 0){ //if the voice is free (note: that this is the assigned frequency not the one actually sounding. If it's "assigned" 0 freq then it's been released although it may still be playing a sound)
                v = idx;
                break;
            }
        }
        this._voiceCycleIdx++;
        if(this._voiceCycleIdx === this._voiceCount)
            this._voiceCycleIdx = 0;
        this._voicesFrequencies[v] = freq;
        return v;
    }

    releaseVoice(freq: number){
        for(let i = 0; i < this._voiceCount; i++){
            if(this._voicesFrequencies[i] === freq){ //if the voice is playing a released freq
                this._voicesFrequencies[i] = 0;
                this._voices[i].gateOff();
            }
        }
    }

    keyDown(freq: number){
        const voiceIdx = this.getFreeVoice(freq);
        this._voices[voiceIdx].frequency = freq;
        this._voices[voiceIdx].gateOn();
        return this._voices[voiceIdx];
    }

    keyUp(freq: number){
        this.releaseVoice(freq);
    }

    bend(cent: number){
        for(let i = 0; i < this._voiceCount; i++){
            this._voices[i].bend(cent);
        }
    }

    modWheel(mod: number){
        for(let i = 0; i < this._voiceCount; i++){
            this._voices[i].modWheel(mod);
        }
    }

    get voices(){
        return this._voices;
    }

    get output(){
        return this._output;
    }

    configure(config: PresetInterface){
        for(let i = 0; i < this._voiceCount; i++){
            if(this._voices[i].configure(config) === false){
                return false;
            }
        }
        return true;
    }
    
}

export default VoicePool;
