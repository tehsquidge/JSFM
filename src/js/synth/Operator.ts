import { TheAmpenvSchema, ThePitchenvSchema, TheFrequencyModeSchema } from "../types/Preset";

class Operator {
    private _ac: AudioContext;
    public _osc: OscillatorNode;
    private _modulationGain: GainNode;
    private _output: GainNode;
    private _feedbackGain: GainNode;
    private _detune: number;
    private _ratio: number;
    private _fixedFrequency: number;
    private _modulationFactor: number;
    private _ampEnv: TheAmpenvSchema;
    private _pitchEnv: ThePitchenvSchema;
    private _mode: 'carrier'|'modulator';
    private _frequencyMode: TheFrequencyModeSchema;
    private _frequency: number;
    public connectsTo: string;
    
    constructor(ac: AudioContext) {
        this._ac = ac;

        this._osc = ac.createOscillator();
        this._osc.frequency.value = 220;

        this._modulationGain = ac.createGain();
        this._modulationGain.gain.value = 1;

        this._output = ac.createGain();
        this._output.gain.value = 0;

        this._feedbackGain = ac.createGain();
        this._feedbackGain.gain.value = 0;
        this._feedbackGain.connect(this._osc.frequency);

        this._detune = 0;
        this._ratio = 1;
        this._fixedFrequency = 0.5;
        this._modulationFactor = 1;

        //this will organise the connections for us
        this.mode = "carrier"; //can be carrier or modulator

        this._ampEnv = {
            'attackTime': 0,
            'decayTime': 1,
            'sustainLevel': 1,
            'releaseTime': 0,
            'modifier': 0.5
        };
        this._pitchEnv = {
            'attackTime': 0,
            'decayTime': 0,
            'sustainLevel': 1,
            'releaseTime': 0,
            'modifier': 1
        };

    }


    connect(a: AudioNode|AudioParam, disconnect: boolean = true) {
        if(disconnect)
            this.disconnect();
        if(a instanceof AudioNode)
            this._output.connect(a);
        if(a instanceof AudioParam)
            this._output.connect(a);
    }

    disconnect() {
        this._output.disconnect();
        this._output.connect(this._feedbackGain);
    }

    modulate(op: Operator, disconnect: boolean = true) {
        this.mode = "modulator";
        this.connect(op._osc.frequency,disconnect);
    }

    reset() {
        this.disconnect();
        this.ratio = 1;
        this.modulationFactor = 1;
    }

    set waveType(wf: OscillatorType) {
        this._osc.type = wf;
    }
    get waveType() {
        return this._osc.type;
    }

    get mode() {
        return this._mode;
    }
    set mode(val) {
        if (val === 'carrier' || val === 'modulator') {
            this._mode = val;
            this._osc.disconnect();
            this._modulationGain.disconnect(); 
            switch(this._mode){
                case 'carrier':
                    this._osc.connect(this._output);
                break;
                case 'modulator':
                    this._osc.connect(this._modulationGain);
                    this._modulationGain.connect(this._output);
                break;
            }
        } else {
            console.log('invalid operator mode');
        }
    }

    get modulationFactor() {
        return this._modulationFactor;
    }
    set modulationFactor(val: number) {
        this._modulationFactor = val; //this can be affected by the MOD Wheel
        this._modulationGain.gain.value = this._modulationFactor;
    }

    get frequencyMode() {
        return this._frequencyMode;
    }
    set frequencyMode(freqMode: TheFrequencyModeSchema) {
        this._frequencyMode = freqMode;
    }

    get feedback() {
        return this._feedbackGain.gain.value;
    }
    set feedback(val: number) {
        this._feedbackGain.gain.value = val;
    }

    get frequency() {
        return this._frequency / this._ratio;
    }
    set frequency(freq: number) {
        this._frequency = freq * this._ratio;
    }

    get fixedFrequency() {
        return this._fixedFrequency;
    }
    set fixedFrequency(freq: number) {
        this._fixedFrequency = freq;
    }

    get ratio() {
        return this._ratio;
    }
    set ratio(ratio: number) {
        const originalFreq = this.frequency;
        this._ratio = ratio;
        this.frequency = originalFreq;
    }

    get detune() {
        return this._detune;
    }
    set detune(d: number) {
        this._detune = d;
        this._osc.detune.value = this._detune;
    }

    bend(cent: number) {
        this._osc.detune.value = this._detune + cent;
    }  

    modWheel(modAmount: number) {
        //modAmount should be 0% to 100%
        this._modulationGain.gain.value =  this._modulationFactor + ( ( (modAmount /100) * this._modulationFactor) * 2 );
    }

    get ampEnv() {
        return this._ampEnv;
    }
    set ampEnv(env: TheAmpenvSchema) {
        this._ampEnv = env;
    }

    get pitchEnv() {
        return this._pitchEnv;
    }
    set pitchEnv(env: ThePitchenvSchema) {
        this._pitchEnv = env;
    }

    gateOn() {
        const now = this._ac.currentTime;

        const targetFreq = (this.frequencyMode == "ratio")? this.frequency * this.ratio : this.fixedFrequency;

        this._output.gain.cancelScheduledValues(now);
        this._output.gain.value = 0.00001;

        this._osc.frequency.cancelScheduledValues(now);

        this._osc.frequency.setValueAtTime(targetFreq, this._ac.currentTime);

        this._osc.frequency.linearRampToValueAtTime( (targetFreq * this._pitchEnv.modifier), now + this._pitchEnv.attackTime);
        this._osc.frequency.linearRampToValueAtTime( (targetFreq * this._pitchEnv.modifier) - ( targetFreq  - (targetFreq * this._pitchEnv.sustainLevel) ), now + this._pitchEnv.attackTime + this._pitchEnv.decayTime);


        this._output.gain.linearRampToValueAtTime(this._ampEnv.modifier, now + this._ampEnv.attackTime);
        this._output.gain.linearRampToValueAtTime(this._ampEnv.sustainLevel * this._ampEnv.modifier, now + this._ampEnv.attackTime + this._ampEnv.decayTime);
    }

    gateOff() {
        if (this._osc.frequency.cancelAndHoldAtTime) {
            this._osc.frequency.cancelAndHoldAtTime(this._ac.currentTime);
        }
        this._osc.frequency.setValueAtTime(this._osc.frequency.value, this._ac.currentTime);
        
        if (this._output.gain.cancelAndHoldAtTime) {
            this._output.gain.cancelAndHoldAtTime(this._ac.currentTime);
        }
        this._output.gain.setValueAtTime(this._output.gain.value, this._ac.currentTime);
        
        let endTime;
        if (this._ampEnv.sustainLevel > 0) {
            endTime = this._ac.currentTime + this._ampEnv.releaseTime;
            this._output.gain.linearRampToValueAtTime(0.000001, endTime);
        } else {
            endTime = this._ac.currentTime;
        } 
        this._output.gain.setValueAtTime(0, endTime);

        const targetFreq = (this.frequencyMode == "ratio")? this.frequency * this.ratio : this.fixedFrequency;

        endTime = this._ac.currentTime + this._pitchEnv.releaseTime;
        this._osc.frequency.linearRampToValueAtTime(targetFreq, endTime);
        this._osc.frequency.setValueAtTime(targetFreq, endTime);
    }

    silence() {
        this._output.gain.setValueAtTime(0, this._ac.currentTime);
    }

    start(){
        this._osc.start();
    }

}

export default Operator;