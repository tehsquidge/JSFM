import { MainStateInterface, MainPropsInterface } from './types/Main';

import MidiInputDevice from "./synth/MIDI/MidiInputDevice";
import KeyboardMIDI from "./synth/MIDI/KeyboardMIDI";

import audioChain from "./synth/index";

import OperatorModule from "./ui-components/OperatorModule";
import ProgrammingModule from "./ui-components/ProgrammingModule";
import VolumeModule from "./ui-components/VolumeModule";
import AnalyserModule from "./ui-components/AnalyserModule";
import ReverbModule from "./ui-components/ReverbModule";
import DelayModule from "./ui-components/DelayModule";
import ChorusModule from "./ui-components/ChorusModule";

import validationPreset from './preset.schema.json';
// @ts-ignore
import initPreset from "./initPreset.mjs";

import Ajv from 'ajv';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validatePreset = ajv.compile(validationPreset);

import '../sass/styles.scss';

import React from "react";
import ReactDOM from "react-dom";
import { OperatorConnectsToInterface } from './types/Preset';



function enableAudioContext(){
    audioChain["ac"].resume();
    audioChain["voicePool"].voices.forEach( v => {
        v.start();
    });
    audioChain["chorus"].start();
}

if(audioChain["ac"].state != 'suspended'){
    enableAudioContext();
}

//midi
const midiController = new MidiInputDevice(audioChain["voicePool"]);
const keyMIDI = new KeyboardMIDI();


class MainPanel extends React.Component<MainPropsInterface,MainStateInterface> {
    constructor(props: any) {
        super(props);
        const preset = JSON.parse(JSON.stringify(initPreset));
        this.buildMIDIDeviceList = this.buildMIDIDeviceList.bind(this);

        this.buildMIDIDeviceList();
        this.state = {
            config: preset,
            MIDI: {
                device: "",
                MIDIDevices: null,
                otherDevices: {
                    'None': null,
                    'Keyboard': keyMIDI
                }
            },
            volume: 0.7,
            reverb: {
                wet: 0,
                dry: 1,
                seconds: 1,
                decay: 1,
                reverse: false
            },
            delay: {
                feedback: 0.00001,
                time: 0.5
            },
            chorus: {
                wet: 0,
                rate: 0.25,
                depth: 0.005
            },
            modifiedStatus: {
                operators: false,
                MIDI: false,
                reverb: false,
                chorus: false,
                delay: false
            }
        };
    }

    componentDidMount() {
        this.applyConfig();
        this.applyEffect("reverb");
        this.applyEffect("delay");
        this.applyEffect("chorus");
        const AnalyserModuleRef = this.refs.analyser as AnalyserModule;
        const cnvs = AnalyserModuleRef.refs.analyserCanvas;
        if(cnvs instanceof HTMLCanvasElement){
            audioChain["analyser"].setCanvas(cnvs);
        }
        audioChain["analyser"].drawLoop();
    }

    handleStateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const path = e.target.name.split(".");
        const depth = path.length;
        let value: string | number = e.target.value;
        if(e.target.type === "number")
            value = parseFloat(value)
        if(e.target.type === "number" && isNaN(value as number)){
            value = 0;
        }

        const state = Object.assign({}, this.state);

        switch (path[0]) {
            case "config":
                state.modifiedStatus.operators = true;
                break;
            case "MIDI":
                state.modifiedStatus.MIDI = true;
                break;
            case "reverb":
                state.modifiedStatus.reverb = true;
                break;
            case "delay":
                state.modifiedStatus.delay = true;
                break;
            case "chorus":
                state.modifiedStatus.chorus = true;
                break;
        }

        let ref: any = state;
        for (let i = 0; i < depth; i += 1) {
            if (i === depth - 1) {
                ref[path[i]] = value;
            } else {
                ref = ref[path[i]];
            }
        }

        this.setState(state);

        switch (path[0]) {
            case "volume":
                audioChain["volume"].gain.value = this.state.volume;
                break;
        }
        if(audioChain["ac.state"] == 'suspended'){
            enableAudioContext();
        }
    }

    applyConfig(e?: React.MouseEvent) {
        if (e) e.preventDefault();
        let config = JSON.parse(JSON.stringify(this.state.config))
        
        if(!audioChain["voicePool"].configure(config)){
            console.log('config failed');
        }

        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.operators = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    saveConfig(e?: React.MouseEvent) {
        if (e) e.preventDefault();

        let data = Object.assign({}, this.state.config);
        let output = "";
        if (typeof data === "object") {
            output = JSON.stringify(data, undefined, 4);
        }

        const blob = new Blob([output], { type: "text/json" }),
            evt = document.createEvent("MouseEvents"),
            a = document.createElement("a");

        a.download = "preset.json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        evt.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
        a.dispatchEvent(evt);
    }

    resetConfig(e?: React.MouseEvent) {
        if (e) e.preventDefault();

        const preset = JSON.parse(JSON.stringify(initPreset));
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.operators = true;
        this.setState({ config: preset, modifiedStatus: modifiedStatus });
    }

    loadPreset(e: React.MouseEvent) {
        const target= e.target as HTMLInputElement;
        const file = (target.files.length > 0)? target.files[0] : null;
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e: Event) => {
            const config = JSON.parse(reader.result as string);
            if(validatePreset(config)){
                const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
                modifiedStatus.operators = true;
                this.setState({ config: config, modifiedStatus: modifiedStatus });
            }else{
                console.log(validatePreset.errors);
                let errorMessage = "Invalid Preset: ";
                validatePreset.errors.forEach(function(err){
                    errorMessage += "\n"+err.message;
                });
                alert(errorMessage);
            }
        }
        reader.readAsText(file);
    }

    applyEffect(effect: string, e?: React.MouseEvent){
        if (e) e.preventDefault();

        audioChain[effect].configure(this.state[effect]);
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus[effect] = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    applyMIDI(e?: React.MouseEvent) {
        if (e) e.preventDefault();
        const deviceID = this.state.MIDI.device;
        if(this.state.MIDI.otherDevices.hasOwnProperty(deviceID)){
            midiController.input = this.state.MIDI.otherDevices[deviceID];
        }else if(this.state.MIDI.MIDIDevices !== null){
            midiController.input = this.state.MIDI.MIDIDevices.get(deviceID);
        }else{
            midiController.input = null;
        }
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.MIDI = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    buildMIDIDeviceList(e?: React.MouseEvent) {
        if (e) e.preventDefault();
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(
                (midi: WebMidi.MIDIAccess) => {
                    //success
                    this.state.MIDI.MIDIDevices = midi.inputs;
                    this.forceUpdate();
                },
                function() {
                    //failure
                    console.log("could not get midi devices");
                }
            );
        } else {
            console.log("no MIDI support");
        }
    }

    render() {
        const operators: OperatorConnectsToInterface[] = ["a", "b", "c", "d"];

        const operatorModules = operators.map( op => (
            <OperatorModule
                config={this.state.config[op]}
                stateChange={this.handleStateChange.bind(this)}
                operator={op}
                key={`operator-${op}`}
                operators={ operators }
            />
        ));

        return [
            ...operatorModules,
            <ProgrammingModule
                key="programming"
                modifiedStatus={this.state.modifiedStatus}
                MIDI={this.state.MIDI}
                stateChange={this.handleStateChange.bind(this)}
                loadPreset={this.loadPreset.bind(this)}
                applyConfig={this.applyConfig.bind(this)}
                saveConfig={this.saveConfig.bind(this)}
                resetConfig={this.resetConfig.bind(this)}
                applyMIDI={this.applyMIDI.bind(this)}
                buildMIDIDeviceList={this.buildMIDIDeviceList.bind(this)}
            />,
            <VolumeModule
                key="volume"
                volume={this.state.volume}
                stateChange={this.handleStateChange.bind(this)}
            />,
            <AnalyserModule key="analyser" ref="analyser" />,
            <ChorusModule
                key="chorus"
                chorus={this.state.chorus}
                modifiedStatus={this.state.modifiedStatus}
                applyChorus={ (e: React.MouseEvent) => { e.preventDefault(); this.applyEffect("chorus"); } }
                stateChange={this.handleStateChange.bind(this)}
            />,
            <ReverbModule
                key="reverb"
                reverb={this.state.reverb}
                modifiedStatus={this.state.modifiedStatus}
                applyReverb={ (e: React.MouseEvent) => { e.preventDefault(); this.applyEffect("reverb"); } }
                stateChange={this.handleStateChange.bind(this)}
            />,
            <DelayModule
                key="delay"
                delay={this.state.delay}
                modifiedStatus={this.state.modifiedStatus}
                applyDelay={ (e: React.MouseEvent) => { e.preventDefault(); this.applyEffect("delay"); } }
                stateChange={this.handleStateChange.bind(this)}
            />
        ];
    }
}
const container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);
ReactDOM.render(<MainPanel />, container);
