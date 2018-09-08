function Reverb(ac) {
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

Reverb.prototype = Object.create(null, {
    constructor: {
        value: Reverb
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
    convolver: {
        get: function () {
            return this._input;
        }
    },
    _constructReverb: {
        value: function () {

            this._convolver = this._ac.createConvolver();

            this._input.connect(this._convolver);
            this._convolver.connect(this._wet);


            var rate = this._ac.sampleRate,
                length = rate * this._seconds,
                impulse = this._ac.createBuffer(2, length, rate),
                impulseL = impulse.getChannelData(0),
                impulseR = impulse.getChannelData(1),
                n, i;

            for (i = 0; i < length; i++) {
                n = this._reverse ? length - i : i;
                impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
                impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
            }
            this._convolver.buffer = null;
            this._convolver.buffer = impulse;
        }
    },
    seconds: {
        get: function () {
            return this._seconds;
        },
        set: function (s) {
            this._seconds = s;
            this._constructReverb();
        }
    },
    decay: {
        get: function () {
            return this._decay;
        },
        set: function (d) {
            this._decay = d;
            this._constructReverb();
        }
    },
    reverse: {
        get: function () {
            return this._reverse;
        },
        set: function (r) {
            this._reverse = r;
            this._constructReverb();
        }
    },
    wet: {
        get: function () {
            return this._wet.gain.value;
        },
        set: function (a) {
            this._wet.gain.value = a;
            this._constructReverb();
        }
    },
    dry: {
        get: function () {
            return this._dry.gain.value;
        },
        set: function (a) {
            this._dry.gain.value = a;
            this._constructReverb();
        }
    },
    configure: {
        value: function (params) {
            this._seconds = params.seconds;
            this._decay = params.decay;
            this._reverse = params.reverse;
            this._wet.gain.value = params.wet;
            this._dry.gain.value = params.dry;
            this._constructReverb();
        }
    }
});

export default Reverb;