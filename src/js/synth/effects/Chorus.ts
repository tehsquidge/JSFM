import { ChorusConfigInterface } from "../../types/Effects";
import EffectBase from "./EffectBase";

class Chorus extends EffectBase{
    private _delayL: DelayNode;
    private _delayLGain: GainNode;
    private _delayR: DelayNode;
    private _delayRGain: GainNode;
    private _outputMerger: ChannelMergerNode;
    private _modulatorL: OscillatorNode;
    private _modulatorLGain: GainNode;
    private _modulatorR: OscillatorNode;
    private _modulatorRGain: GainNode;
    _delayLPanner: StereoPannerNode;
    _delayRPanner: StereoPannerNode;
    
    constructor(ac: AudioContext) {
        super(ac);

        /* nodes */
        this._delayL = ac.createDelay(5.0);
        this._delayL.delayTime.value = 0.02;
        this._delayLPanner = ac.createStereoPanner();
        this._delayLPanner.pan.value = -0.25;
        this._delayLGain = ac.createGain();
        this._delayLGain.gain.value = 0.75;
        this._delayLGain.connect(this._delayLPanner);
        this._delayLPanner.connect(this._delayL);

        this._delayR = ac.createDelay(5.0);
        this._delayR.delayTime.value = 0.03;
        this._delayRPanner = ac.createStereoPanner();
        this._delayRPanner.pan.value = 0.25;
        this._delayRGain = ac.createGain();
        this._delayRGain.gain.value = 0.75;
        this._delayRGain.connect(this._delayRPanner);
        this._delayRPanner.connect(this._delayR)

        this._outputMerger = ac.createChannelMerger(4);

        /* connections */
        this._input.connect(this._outputMerger,0,0); //clean
        this._input.connect(this._outputMerger,0,1); //clean
        this._input.connect(this._delayLGain,0,0); //LDelay
        this._input.connect(this._delayRGain,0,0); //RDelay

        this._delayR.connect(this._outputMerger,0,2);
        this._delayL.connect(this._outputMerger,0,3);


        this._outputMerger.connect(this.output);

        //modulation
        this._modulatorL = ac.createOscillator();
        this._modulatorLGain = ac.createGain();
        this._modulatorL.connect(this._modulatorLGain);
        this._modulatorLGain.connect(this._delayL.delayTime);
        this._modulatorLGain.gain.value = 0.05;
        this._modulatorL.frequency.value = 0.25;
        this._modulatorR = ac.createOscillator();
        this._modulatorRGain = ac.createGain();
        this._modulatorR.connect(this._modulatorRGain);
        this._modulatorRGain.connect(this._delayR.delayTime);
        this._modulatorRGain.gain.value = 0.05;
        this._modulatorR.frequency.value = 0.25;
    }

    get depth() {
        return this._modulatorLGain.gain.value;
    }
    set depth(d: number) {
        this._modulatorLGain.gain.value = d;
        this._modulatorRGain.gain.value = d;

    }

    get rate() {
        return this._modulatorL.frequency.value;
    }
    set rate(r: number) {
        this._modulatorL.frequency.value  = r;
        this._modulatorR.frequency.value  = r * 1.1;
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
        this._modulatorL.start();
        this._modulatorR.start();
    }

}

export default Chorus;