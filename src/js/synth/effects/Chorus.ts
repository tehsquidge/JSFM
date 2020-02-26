import { ChorusConfigInterface } from "../../types/Effects";

class Chorus {
    private _ac: AudioContext; 
    private _delayL: DelayNode;
    private _delayLGain: GainNode;
    private _delayR: DelayNode;
    private _delayRGain: GainNode;
    private _input: GainNode;
    private _output: GainNode;
    private _merger: ChannelMergerNode;
    private _splitter: ChannelSplitterNode;
    private _modulator: OscillatorNode;
    private _modulatorGain: GainNode;
    
    constructor(ac: AudioContext) {
        this._ac = ac;

        this._delayL = ac.createDelay(5.0);
        this._delayL.delayTime.value = 0.003;
        this._delayLGain = ac.createGain();
        this._delayLGain.gain.value = 0.75;
        this._delayLGain.connect(this._delayL);

        this._delayR = ac.createDelay(5.0);
        this._delayR.delayTime.value = 0.005;
        this._delayRGain = ac.createGain();
        this._delayRGain.gain.value = 0.75;
        this._delayRGain.connect(this._delayR);

        this._input = this._ac.createGain();
        this._output = this._ac.createGain();

        this._merger = ac.createChannelMerger(2);
        this._splitter = ac.createChannelSplitter(2);

        this._input.connect(this._merger, 0, 1);
        this._input.connect(this._merger, 0, 0);
        this._delayR.connect(this._merger, 0, 1);
        this._delayL.connect(this._merger, 0, 0);

        this._merger.connect(this._splitter);

        this._splitter.connect(this._output, 0);
        this._splitter.connect(this._delayLGain, 1);

        //modulation
        this._modulator = ac.createOscillator();
        this._modulatorGain = ac.createGain();
        this._modulator.connect(this._modulatorGain);
        this._modulatorGain.connect(this._delayL.delayTime);
        this._modulatorGain.gain.value = 0.05;
        this._modulator.frequency.value = 0.25;
    }

    connect(a: AudioNode) {
        this.disconnect();
        this._output.connect(a);
    }

    disconnect() {
        this._output.disconnect();
    }

    get input(){
        return this._input;
    }

    get depth() {
        return this._modulatorGain.gain.value;
    }
    set depth(d: number) {
        this._modulatorGain.gain.value = d;
    }

    get rate() {
        return this._modulator.frequency.value;
    }
    set rate(r: number) {
        this._modulator.frequency.value  = r;
    }

    get wet() {
        return this._delayLGain.gain.value ;
    }
    set wet(w: number) {
        this._delayLGain.gain.value = w;
        this._delayRGain.gain.value = w;
    }

    configure(a: ChorusConfigInterface){
        this.depth = a.depth;
        this.rate  = a.rate;
        this.wet = a.wet;
    }

    start(){
        this._modulator.start();
    }

}

export default Chorus;