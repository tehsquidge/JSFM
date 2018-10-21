function MidiInputDevice(voicePool){
    this._input = null;
    this._output = null;
    this._voicePool = voicePool;
}

MidiInputDevice.prototype = Object.create(Object,{
    constructor:{
        value: MidiInputDevice
    },
    onMIDIMessage: {
        value: function(message) {
            var freq = 440 * Math.pow(2, (message.data[1] - 69) / 12);
            switch(message.data[0]){
                case 144: //keydown
                    this._voicePool.keyDown(freq);
                    break;
                case 128: //keyup
                    this._voicePool.keyUp(freq);
                    break;
                case 176: //controll change
                    switch(message.data[1]){
                        case 1: //mod wheel
                            this._voicePool.modWheel( (message.data[2]/128) * 100 );
                        break;
                    }
                    break;
                case 224: //pitch bend
                    //64 is in the middle. We want to transpose that to 0.
                    var bend = 64 - message.data[2];
                    var cent = ((bend/64) * 100) * -1; // convert to cent ( * -1 to invert)
                    this._voicePool.bend(cent * 2); //times 2 for two semitones max
                    break;
                default:
                    //u w0t m8? if it's not something we know....
                    console.log(message);
                    break;
            }

        }
    },
    input: {
        get: function(){
            return this._input;
        },
        set: function(i){
            if(this._input instanceof MIDIInput){
                this._input.onmidimessage = null;
            }
            this._input = i;
            if(this._input != null){
                this._input.onmidimessage = function(m){ this.onMIDIMessage(m); }.bind(this);
            }
        }
    },
    output: {
        get: function(){
            return this._output;
        },
        set: function(i){
            this._output = i;
        }
    }
});

export default MidiInputDevice;
