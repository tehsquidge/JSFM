import Analyser from "./Analyser";
import VoicePool from "./VoicePool";
import Reverb from "./effects/Reverb";
import Delay from "./effects/Delay";
import Chorus from "./effects/Chorus";


export const ac = new AudioContext();
export const voicePool = new VoicePool(ac);
export const analyser = new Analyser(ac);
export const chorus = new Chorus(ac);
export const reverb = new Reverb(ac);
export const delay = new Delay(ac);
export const volume = ac.createGain();

voicePool.output.connect(volume);

volume.connect(analyser.input);

analyser.connect(chorus.input);


chorus.connect(reverb.input);

reverb.connect(delay.input);

delay.connect(ac.destination);