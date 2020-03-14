import { DelayConfigInterface } from "../../types/Effects";
import EffectBase from "./EffectBase";

class Delay extends EffectBase {
    private _delay: DelayNode;
    private _delayGain: GainNode;
    private _merger: ChannelMergerNode;
    private _splitter: ChannelSplitterNode;
    
    constructor(ac: AudioContext) {
        super(ac);
        this._delay = ac.createDelay(5.0);
        this._delay.delayTime.value = 2.5;

        this._delayGain = ac.createGain();
        this._delayGain.gain.value = 0.5;
        this._delayGain.connect(this._delay)

        this._input = this._ac.createGain();
        this._output = this._ac.createGain();

        this._input.connect(this._output);
        this._input.connect(this._delayGain);

        this._delay.connect(this._output);
        this._delay.connect(this._input);

    }

    get delayTime() {
        return this._delay.delayTime.value;
    }
    set delayTime(d: number) {
        this._delay.delayTime.value = d;
    }

    get delayFeedback() {
        return this._delayGain.gain.value;
    }
    set delayFeedback(f: number) {
        this._delayGain.gain.value = f;
    }

    configure(a: DelayConfigInterface){
        this._delay.delayTime.value = a.time;
        this._delayGain.gain.value = a.feedback;
    }

}

export default Delay;