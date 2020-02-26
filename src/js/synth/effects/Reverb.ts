import { ReverbConfigInterface } from "../../types/Effects";

class Reverb {
    private _ac: AudioContext;
    private _convolver: ConvolverNode | null;
    private _output: GainNode;
    private _wet: GainNode;
    private _input: GainNode;
    private _dry: GainNode;
    private _seconds: number;
    private _decay: number;
    private _reverse: boolean;
    
    constructor(ac: AudioContext) {
        this._ac = ac;

        this._convolver = null; //we create a new convolver each time we change settings.

        this._output = this._ac.createGain();
        this._input = this._ac.createGain();
        this._wet = this._ac.createGain();
        this._dry = this._ac.createGain();

        this._input.connect(this._dry);

        this._wet.connect(this._output);
        this._dry.connect(this._output);

        this._seconds = 1;
        this._decay = 1;
        this._reverse = false;
        this._constructReverb();
    }

    connect(a: AudioNode) {
        this.disconnect();
        this._output.connect(a);
    }

    connectWet(a: AudioNode) {
        this.disconnect();
        this._wet.connect(a);
    }

    disconnect() {
        this._output.disconnect();
    }

    get input() {
        return this._input;
    }

    _constructReverb() {
        try {
            this._convolver.disconnect();
            this._input.disconnect();
            delete this._convolver;
        } catch(e) {
            //nothing to disconnect
        }
        this._convolver = this._ac.createConvolver();
        this._input.connect(this._dry);
        this._input.connect(this._convolver);
        this._convolver.connect(this._wet);


        const rate = this._ac.sampleRate,
            length = rate * this._seconds,
            impulse = this._ac.createBuffer(2, length, rate),
            impulseL = impulse.getChannelData(0),
            impulseR = impulse.getChannelData(1);
        let n, i;

        for (i = 0; i < length; i++) {
            n = this._reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
        }
        this._convolver.buffer = null;
        this._convolver.buffer = impulse;
    }

    get seconds() {
        return this._seconds;
    }
    set seconds(s: number) {
        this._seconds = s;
        this._constructReverb();
    }

    get decay() {
        return this._decay;
    }
    set decay(d: number) {
        this._decay = d;
        this._constructReverb();
    }

    get reverse() {
        return this._reverse;
    }
    set reverse(r: boolean) {
        this._reverse = r;
        this._constructReverb();
    }

    get wet() {
        return this._wet.gain.value;
    }
    set wet(a: number) {
        this._wet.gain.value = a;
        this._constructReverb();
    }

    get dry() {
        return this._dry.gain.value;
    }
    set dry(a) {
        this._dry.gain.value = a;
        this._constructReverb();
    }

    configure(params: ReverbConfigInterface) {
        this._seconds = params.seconds;
        this._decay = params.decay;
        this._reverse = !!params.reverse;
        this._wet.gain.value = params.wet;
        this._dry.gain.value = params.dry;
        this._constructReverb();
    }
    
}

export default Reverb;