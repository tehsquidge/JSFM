import Analyser from "./prototypes/Analyser";
import VoicePool from "./prototypes/VoicePool";
import Reverb from "./prototypes/Reverb";
import Delay from "./prototypes/Delay";
import Chorus from "./prototypes/Chorus";
import MidiInputDevice from "./prototypes/MIDI/MidiInputDevice";
import KeyboardMIDI from "./prototypes/MIDI/KeyboardMIDI";

import OperatorModule from "./ui-components/OperatorModule.jsx";
import ProgrammingModule from "./ui-components/ProgrammingModule.jsx";
import VolumeModule from "./ui-components/VolumeModule.jsx";
import AnalyserModule from "./ui-components/AnalyserModule.jsx";
import ReverbModule from "./ui-components/ReverbModule.jsx";
import DelayModule from "./ui-components/DelayModule.jsx";
import ChorusModule from "./ui-components/ChorusModule.jsx";

import validatePreset from './preset.schema.json';
import initPreset from "./initPreset.mjs";

import '../sass/styles.scss';

import React from "react";
import ReactDOM from "react-dom";

const ac = new AudioContext();
const voicePool = new VoicePool(ac);
const analyser = new Analyser(ac);
const chorus = new Chorus(ac);
const reverb = new Reverb(ac);
const delay = new Delay(ac);
const volume = ac.createGain();

voicePool.output.connect(volume);

volume.connect(analyser.input);

analyser.connect(chorus.input);

chorus.connect(reverb.input);

reverb.connect(delay.input);

delay.connect(ac.destination);


function enableAudioContext(){
    ac.resume();
    voicePool.voices.forEach( v => {
        v.start();
    });
    chorus.start();
}

if(ac.state != 'suspended'){
    enableAudioContext();
}


//midi
const midiController = new MidiInputDevice(voicePool);
const keyMIDI = new KeyboardMIDI();

class MainPanel extends React.Component {
    constructor() {
        super();
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
                reverse: 0
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
                chorus: false
            }
        };
    }

    componentDidMount() {
        this.applyConfig();
        this.applyReverb();
        this.applyDelay();
        this.applyChorus();
        analyser.setCanvas(
            ReactDOM.findDOMNode(this.refs.analyser.refs.analyserCanvas)
        );
        analyser.drawLoop();
    }

    handleStateChange(e) {
        const path = e.target.name.split(".");
        const depth = path.length;
        let value =
            e.target.type === "number"
                ? parseFloat(e.target.value)
                : e.target.value;
        if(e.target.type === "number" && isNaN(value)){
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

        let ref = state;
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
                volume.gain.value = this.state.volume;
                break;
        }
        if(ac.state == 'suspended'){
            enableAudioContext();
        }
    }

    applyConfig(e) {
        if (e) e.preventDefault();
        let config = JSON.parse(JSON.stringify(this.state.config))
        
        if(!voicePool.configure(config)){
            console.log('config failed');
        }

        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.operators = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    saveConfig(e) {
        if (e) e.preventDefault();

        let data = Object.assign({}, this.state.config);
        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4);
        }

        const blob = new Blob([data], { type: "text/json" }),
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

    resetConfig(e) {
        if (e) e.preventDefault();

        const preset = JSON.parse(JSON.stringify(initPreset));
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.operators = true;
        this.setState({ config: preset, modifiedStatus: modifiedStatus });
    }

    loadPreset(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const config = JSON.parse(e.target.result);
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
        }.bind(this);
        reader.readAsText(file);
    }

    applyReverb(e) {
        if (e) e.preventDefault();

        reverb.configure(this.state.reverb);
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.reverb = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    applyDelay(e) {
        if (e) e.preventDefault();

        delay.configure(this.state.delay);
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.delay = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    applyChorus(e) {
        if (e) e.preventDefault();

        chorus.configure(this.state.chorus);
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.chorus = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    applyMIDI(e) {
        if (e) e.preventDefault();
        const deviceID = this.state.MIDI.device;
        if(this.state.MIDI.otherDevices.hasOwnProperty(deviceID)){
            midiController.input = this.state.MIDI.otherDevices[deviceID];
        }else{
            midiController.input = this.state.MIDI.MIDIDevices.get(deviceID);
        }
        const modifiedStatus = Object.assign({}, this.state.modifiedStatus);
        modifiedStatus.MIDI = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    buildMIDIDeviceList(e) {
        if (e) e.preventDefault();
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(
                function(midi) {
                    //success
                    this.state.MIDI.MIDIDevices = midi.inputs;
                    this.forceUpdate();
                }.bind(this),
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
        return [
            <OperatorModule
                config={this.state.config.a}
                stateChange={this.handleStateChange.bind(this)}
                operator="a"
                key="operator-a"
                operators={["a", "b", "c", "d"]}
            />,
            <OperatorModule
                config={this.state.config.b}
                stateChange={this.handleStateChange.bind(this)}
                operator="b"
                key="operator-b"
                operators={["a", "b", "c", "d"]}
            />,
            <OperatorModule
                config={this.state.config.c}
                stateChange={this.handleStateChange.bind(this)}
                operator="c"
                key="operator-c"
                operators={["a", "b", "c", "d"]}
            />,
            <OperatorModule
                config={this.state.config.d}
                stateChange={this.handleStateChange.bind(this)}
                operator="d"
                key="operator-d"
                operators={["a", "b", "c", "d"]}
            />,
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
                applyChorus={this.applyChorus.bind(this)}
                stateChange={this.handleStateChange.bind(this)}
            />,
            <ReverbModule
                key="reverb"
                reverb={this.state.reverb}
                modifiedStatus={this.state.modifiedStatus}
                applyReverb={this.applyReverb.bind(this)}
                stateChange={this.handleStateChange.bind(this)}
            />,
            <DelayModule
                key="delay"
                delay={this.state.delay}
                modifiedStatus={this.state.modifiedStatus}
                applyDelay={this.applyDelay.bind(this)}
                stateChange={this.handleStateChange.bind(this)}
            />
        ];
    }
}
const container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);
ReactDOM.render(<MainPanel />, container);
