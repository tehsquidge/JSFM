import VoicePool from "../synth/VoicePool";
import { MainStateInterface } from "../types/Main";

import validationPreset from '../preset.schema.json';
// @ts-ignore
import initPreset from "../initPreset.mjs";

import Ajv from 'ajv';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validatePreset = ajv.compile(validationPreset);

export interface ConfigManagerInterface {
    getState(): MainStateInterface;
    setState(): void;
    voicePool: VoicePool;
}

export default class ConfigManager {
    getState: () => MainStateInterface;
    setState: ({}) => void;
    voicePool: VoicePool;

    constructor(props: ConfigManagerInterface){
        this.getState = props.getState;
        this.voicePool =  props.voicePool;
        this.setState = props.setState;
    }

    applyConfig(e?: React.MouseEvent) {
        if (e) e.preventDefault();
        let config = JSON.parse(JSON.stringify(this.getState().config))
        
        if(!this.voicePool.configure(config)){
            console.log('config failed');
        }

        const modifiedStatus = Object.assign({}, this.getState().modifiedStatus);
        modifiedStatus.operators = false;
        this.setState({ modifiedStatus: modifiedStatus });
    }

    saveConfig(e?: React.MouseEvent) {
        if (e) e.preventDefault();

        let data = Object.assign({}, this.getState().config);
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
        const modifiedStatus = Object.assign({}, this.getState().modifiedStatus);
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
                const modifiedStatus = Object.assign({}, this.getState().modifiedStatus);
                modifiedStatus.operators = true;
                this.setState({ config: config, modifiedStatus: modifiedStatus });
                this.getState().config = config;
                this.getState().modifiedStatus = modifiedStatus;
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
}