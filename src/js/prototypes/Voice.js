
import Operator from './Operator';
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
            for (let key in this._operators) {
                this._operators[key].reset();
            }
        }
    },
    start: {
        value: function () {
            for (let key in this._operators) {
                this._operators[key].start();
            }
        }
    },
    configure: {
        value: function (params) {
            try {
                for (let opKey in params) {
                    const op = this._operators[opKey];
                    op.waveType = params[opKey].waveType;
                    op.modulationFactor = params[opKey].modulationFactor;
                    op.ratio = params[opKey].ratio;
                    op.fixedFrequency = params[opKey].fixedFrequency;
                    op.frequencyMode = params[opKey].frequencyMode;
                    op.feedback = params[opKey].feedback;
                    op.detune = params[opKey].detune;
                    op.ampEnv = params[opKey].ampEnv;
                    op.pitchEnv = params[opKey].pitchEnv;
                    op.disconnect();
                    op.silence(); //kill sound to stop horrible noises which can occur when switching from high-gain-modulation to output.


                    params[opKey].connectsTo.split(" + ").forEach(conn => {
                        switch (conn) {
                            case 'none':
                                op.disconnect();
                                break;
                            case 'output':
                                op.mode = 'carrier';
                                op.connect(this._output);
                                break;
                            case 'a':
                            case 'b':
                            case 'c':
                            case 'd':
                                op.mode = 'modulator';
                                op.modulate(this._operators[conn],false);
                                break;
                        }                        
                    });

                }
                return true;
            }
            catch(e){
                console.log(e);
                return false;
            }
        }
    },
    frequency: {
        get: function () {
            return this._frequency;
        },
        set: function (newFreq) {
            this._frequency = newFreq;
            for (let key in this._operators) {
                this._operators[key].frequency = newFreq;
            }
        }
    },
    bend: {
        value: function(cent){
            for (let key in this._operators) {
                this._operators[key].bend(cent);
            }
        }
    },
    modWheel: {
        value: function(mod){
            for (let key in this._operators) {
                this._operators[key].modWheel(mod);
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
            for (let key in this._operators) {
                if (this._operators.hasOwnProperty(key)) {
                    this._operators[key].gateOn();
                }
            }
        }
    },
    gateOff: {
        value: function () {
            for (let key in this._operators) {
                if (this._operators.hasOwnProperty(key)) {
                    this._operators[key].gateOff();
                }
            }
        }
    }
});

export default Voice;