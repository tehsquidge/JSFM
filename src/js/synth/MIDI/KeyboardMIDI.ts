export default class KeyboardMIDI {
    _keys: {};
    _octave: number;

    constructor(){
        this._keys = {
            'A': 0,  //C
            'W': 1,  //C#
            'S': 2,  //D
            'E': 3,  //D#
            'D': 4,  //E
            'F': 5,  //F
            'T': 6,  //F#
            'G': 7,  //G
            'Y': 8,  //G#
            'H': 9,  //A
            'U': 10, //A#
            'J': 11, //B
            'K': 12, //C
            'O': 13, //C#
            'L': 14, //D
            'P': 15, //D#
            ';': 16 // E
        }
        
        this.octave = 3;

        document.addEventListener('keydown', this.onkeyevent.bind(this));
        document.addEventListener('keyup', this.onkeyevent.bind(this));
    }

    onkeyevent(e) {
        if(e.repeat) return;
        const key = e.key.toUpperCase();
        const gateOn = (e.type === 'keydown');
        switch(key){
            case 'Z':
                if(gateOn) this.octave--;
            break;
            case 'X':
                if(gateOn) this.octave++;
            break;
            default:
                if(this._keys.hasOwnProperty(key)){
                    const MIDIMessage ={
                        data: []
                    };
                    MIDIMessage.data[0] = (gateOn)? 144 : 128;
                    MIDIMessage.data[1] = this._keys[key] + (this._octave * 12);
                    if(this.onmidimessage)
                        this.onmidimessage(MIDIMessage);
                }
            break;
        }
    }

    onmidimessage(message){
        console.log(message);
    }

    /**
     * 
     * Octave -1 starts at 0 in MIDI and Octave 0 starts at 12. We have to offset.
     * Octave is stored as starting at 0.
     */

    get octave(){
        return this._octave - 1;
    }

    set octave(o){
        this._octave = o + 1;
        if(this._octave > 6){
            this._octave = 6;
        }
        if(this._octave < 0){
            this._octave = 0;
        }
    }

}