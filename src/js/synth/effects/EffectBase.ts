export default abstract class EffectBase {
    protected _ac: AudioContext;
    protected _input: GainNode;
    protected _output: GainNode;

    constructor(ac: AudioContext) {
        this._ac = ac;
        this._output = this._ac.createGain();
        this._input = this._ac.createGain();
    }

    connect(a: AudioNode) {
        this.disconnect();
        this._output.connect(a);
    }

    disconnect() {
        this._output.disconnect();
    }

    get input() {
        return this._input;
    }

    get output() {
        return this._output;
    }
}