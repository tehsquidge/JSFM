function Delay(ac) {
    this._ac = ac;

    this._delay = ac.createDelay(5.0);
    this._delay.delayTime.value = 2.5;

    this._delayGain = ac.createGain();
    this._delayGain.gain.value = 0.5;
    this._delayGain.connect(this._delay)

    this._input = this._ac.createGain();
    this._output = this._ac.createGain();

    this._merger = ac.createChannelMerger(2);
    this._splitter = ac.createChannelSplitter(2);

    this._input.connect(this._merger, 0, 1);
    this._input.connect(this._merger, 0, 0);
    this._delay.connect(this._merger, 0, 1);
    this._delay.connect(this._merger, 0, 0);

    this._merger.connect(this._splitter);

    this._splitter.connect(this._output, 0);
    this._splitter.connect(this._delayGain, 1);
}

Delay.prototype = Object.create(null, {
    constructor: {
        value: Delay
    },
    connect: {
        value: function (a) {
            this.disconnect();
            this._output.connect(a);
        }
    },
    disconnect: {
        value: function () {
            this._output.disconnect();
        }
    },
    input: {
        get: function () {
            return this._input;
        }
    },
    delayTime: {
        get: function () {
            return this._delay.delayTime.value;
        },
        set: function (d) {
            this._delay.delayTime.value = d;
        }
    },
    delayFeedback: {
        get: function () {
            return this._delayGain.gain.value;
        },
        set: function (d) {
            this._delayGain.gain.value = d;
        }
    },
    configure: {
        value: function(a){
            this._delay.delayTime.value = a.time;
            this._delayGain.gain.value = a.feedback;
        }
    }
});

export default Delay;