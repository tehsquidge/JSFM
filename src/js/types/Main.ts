import { PresetInterface } from './Preset';
import { ChorusConfigInterface, DelayConfigInterface, ReverbConfigInterface } from './Effects';

export interface ModifiedStatusInterface {
        operators: boolean,
        MIDI: boolean,
        reverb: boolean,
        chorus: boolean,
        delay: boolean
}
export interface MIDIConfigInterface {
        device: string,
        MIDIDevices: WebMidi.MIDIInputMap | null,
        otherDevices: {[key: string]: any}
}
export interface MainPropsInterface {};
export interface MainStateInterface {
    config: PresetInterface,
    MIDI: MIDIConfigInterface,
    volume: number,
    reverb: ReverbConfigInterface,
    delay: DelayConfigInterface,
    chorus: ChorusConfigInterface,
    modifiedStatus: ModifiedStatusInterface
};