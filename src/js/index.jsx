import Analyser from './prototypes/Analyser';
import VoicePool  from './prototypes/VoicePool';
import Reverb  from './prototypes/Reverb';
import MidiInputDevice from './prototypes/MIDI/MidiInputDevice';

import OperatorModule from './ui-components/OperatorModule.jsx';
import ProgrammingModule from './ui-components/ProgrammingModule.jsx';
import VolumeModule from './ui-components/VolumeModule.jsx';
import AnalyserModule from './ui-components/AnalyserModule.jsx';
import ReverbModule from './ui-components/ReverbModule.jsx';

import initPreset from './initPreset';

import '../sass/styles.scss';

import React from "react";
import ReactDOM from "react-dom";


var ac = new AudioContext();

var voicePool = new VoicePool(ac);
var analyser = new Analyser(ac);
var reverb = new Reverb(ac);
var volume = ac.createGain();


voicePool.output.connect(volume);

volume.connect(analyser.analyser);

analyser.connect(reverb.convolver);

reverb.connect(ac.destination);

//midi
var midiController = new MidiInputDevice(voicePool);

class MainPanel extends React.Component {

    constructor () {
        super();
        const preset = JSON.parse(JSON.stringify(initPreset));
        this.buildMIDIDeviceList = this.buildMIDIDeviceList.bind(this);

        this.buildMIDIDeviceList();
        this.state = {
            "config": preset,
            "MIDI": {
                "device": "",
                "MIDIDevices": null
            },
            "volume": 0.8,
            "reverb": {
                "wet": 0,
                "dry": 1,
                "seconds": 1,
                "decay": 1,
                "reverse": 0
            },
            "modifiedStatus": {
                "operators": false,
                "MIDI": false,
                "reverb": false
            },
        };
    }

    componentDidMount () {
        this.applyConfig();
        analyser.setCanvas( ReactDOM.findDOMNode(this.refs.analyser.refs.analyserCanvas) );
        analyser.drawLoop();
    }
    
    handleStateChange (e) {
        const path = e.target.name.split('.');
        const depth = path.length;
        const value = (e.target.type === 'number')? parseFloat(e.target.value) : e.target.value;
    
        var state = Object.assign({},this.state);
    
        switch(path[0]){
        case 'config':
            state.modifiedStatus.operators = true;
        break;
        case 'MIDI':
            state.modifiedStatus.MIDI = true;
        break;
        case 'reverb':
            state.modifiedStatus.reverb = true;
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

        switch(path[0]){
            case 'volume':
                volume.gain.value = this.state.volume;
            break;     
        }
    }

    applyConfig(e){
        if (e) e.preventDefault();

        voicePool.configure( Object.assign({},this.state.config) );

        const modifiedStatus = Object.assign({},this.state.modifiedStatus);
        modifiedStatus.operators = false;
        this.setState({ "modifiedStatus": modifiedStatus });
    }

    saveConfig (e){
        if (e) e.preventDefault();

        var data = Object.assign({},this.state.config);
        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4);
        }
    
        var blob = new Blob([data], {type: 'text/json'}),
            evt    = document.createEvent('MouseEvents'),
            a    = document.createElement('a');
    
        a.download = 'preset.json';
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
        evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(evt); 
    }
    
    resetConfig (e) {
        if (e) e.preventDefault();

        const preset = JSON.parse(JSON.stringify(initPreset));
        const modifiedStatus = Object.assign({},this.state.modifiedStatus);
        modifiedStatus.operators = true;
        this.setState({ "config": preset, "modifiedStatus": modifiedStatus } );
    }
    
    loadPreset (e) {
        const file = e.target.files[0];
        if (!file) {
        return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            const config = JSON.parse(e.target.result);
            const modifiedStatus = Object.assign({},this.state.modifiedStatus);
            modifiedStatus.operators = true;
            this.setState({ "config": config, "modifiedStatus": modifiedStatus });
        }.bind(this);
        reader.readAsText(file);
    }
    
    applyReverb (e) {
        if (e) e.preventDefault();

        reverb.configure(this.state.reverb);
        const modifiedStatus = Object.assign({},this.state.modifiedStatus);
        modifiedStatus.reverb = false;
        this.setState({"modifiedStatus": modifiedStatus } );
    }

    applyMIDI (e) {
        if (e) e.preventDefault();

        const deviceID = this.state.MIDI.device;
        midiController.input = this.state.MIDI.MIDIDevices.get(deviceID);
        const modifiedStatus = Object.assign({},this.state.modifiedStatus);
        modifiedStatus.MIDI = false;
        this.setState({"modifiedStatus": modifiedStatus } );
    }
    buildMIDIDeviceList (e) {
        if(e) e.preventDefault();
        var self = this;
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(
                function(midi){ //success
                    self.state.MIDI.MIDIDevices = midi.inputs;
                    self.forceUpdate();
                },
                function(){ //failure
                    console.log('could not get midi devices');
                }
            );
        }else{
            console.log('no MIDI support');
        }
    }
    render () {
        return [
            <OperatorModule config={this.state.config.a} stateChange={ this.handleStateChange.bind(this) } operator="a" operators={['a','b','c','d']} />,
            <OperatorModule config={this.state.config.b} stateChange={ this.handleStateChange.bind(this) } operator="b" operators={['a','b','c','d']} />,
            <OperatorModule config={this.state.config.c} stateChange={ this.handleStateChange.bind(this) } operator="c" operators={['a','b','c','d']} />,
            <OperatorModule config={this.state.config.d} stateChange={ this.handleStateChange.bind(this) } operator="d" operators={['a','b','c','d']} />,
            <ProgrammingModule
            modifiedStatus={this.state.modifiedStatus}
            MIDI={this.state.MIDI}
            stateChange={ this.handleStateChange.bind(this) }
            loadPreset={ this.loadPreset.bind(this) }
            applyConfig={ this.applyConfig.bind(this) }
            saveConfig={ this.saveConfig.bind(this) }
            resetConfig={ this.resetConfig.bind(this) }
            applyMIDI={ this.applyMIDI.bind(this) }
            buildMIDIDeviceList={this.buildMIDIDeviceList.bind(this)} />,
            <VolumeModule volume={this.state.volume} stateChange={ this.handleStateChange.bind(this) } />,
            <AnalyserModule ref="analyser" />,
            <ReverbModule reverb={this.state.reverb} modifiedStatus={this.state.modifiedStatus} applyReverb={this.applyReverb.bind(this)} stateChange={ this.handleStateChange.bind(this) } />
        ];
    
    }
    }


ReactDOM.render(<MainPanel/>, window.document.getElementById("controller"));