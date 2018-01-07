function Voice(ac) {
    this._ac = ac;

    this._output = ac.createGain();

    this._operators = {};
    this._operators.a = new Operator(ac);
    this._operators.b = new Operator(ac);
    this._operators.c = new Operator(ac);
    this._operators.d = new Operator(ac);

    this.frequency = 440;

}


Voice.prototype = Object.create(null, {
    constructor: {
        value: Voice
    },
    reset: {
        value: function () {
            for (var key in this._operators) {
                this._operators[key].reset();
            }
        }
    },
    configure: {
        value: function (params) {
            for(var opKey in params){
                var op = this._operators[opKey];
                op.silence(); //kill sound to stop horrible noises which can occur when switching from high-gain-modulation to output.

                switch(params[opKey].connectsTo){
                    case 'none':
                        op.disconnect();
                        return;
                    break;
                    case 'output':
                        op.connect(this._output);
                        op.mode = 'carrier';
                    break;
                    case 'a':
                    case 'b':
                    case 'c':
                    case 'd':
                        op.connect(this._operators[params[opKey].connectsTo]._osc.frequency);
                        op.mode = 'modulator';
                    break;
                }
                op.waveType = params[opKey].waveType;
                op.modulationFactor = params[opKey].modulationFactor;
                op.ratio = params[opKey].ratio;
                op.detune = params[opKey].detune;
                op.envelope = params[opKey].envelope;
            }
        }
    },
    frequency: {
        get: function(){
            return this._frequency;
        },
        set: function(newFreq){
            this._frequency = newFreq;
            for (var key in this._operators) {
                this._operators[key].frequency = newFreq;
            }
        }
    },
    output: {
        get: function () {
            return this._output;
        }
    },
    gateOn: {
        value: function () {
            for (var key in this._operators) {
                if (this._operators.hasOwnProperty(key)) {
                    this._operators[key].gateOn();
                }
            }
        }
    },
    gateOff: {
        value: function () {
            for (var key in this._operators) {
                if (this._operators.hasOwnProperty(key)) {
                    this._operators[key].gateOff();
                }
            }
        }
    }
});