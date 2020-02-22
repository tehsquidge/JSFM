import {TheRootSchema as PresetInterface} from './Preset';
import { ChorusConfigInterface, DelayConfigInterface, ReverbConfigInterface } from './Effects';

export interface MainPropsInterface {};
export interface MainStateInterface {
    config: PresetInterface,
    MIDI: {
        device: string,
        MIDIDevices: WebMidi.MIDIInputMap | null,
        otherDevices: {[key: string]: any}
    },
    volume: number,
    reverb: ReverbConfigInterface,
    delay: DelayConfigInterface,
    chorus: ChorusConfigInterface,
    modifiedStatus: {
        operators: boolean,
        MIDI: boolean,
        reverb: boolean,
        chorus: boolean,
        delay: boolean
    }
};