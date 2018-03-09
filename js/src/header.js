var ac = new AudioContext();

var MidiDevices = null;
var midiController = null;
var defaultPreset = {
    "a": {
        "connectsTo": "output",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    },
    "b": {
        "connectsTo": "none",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    },
    "c": {
        "connectsTo": "none",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    },
    "d": {
        "connectsTo": "none",
        "waveType": "sine",
        "ratio": 1,
        "detune": 0,
        "modulationFactor": 400,
        "ampEnv": {
            "attackTime": 0.25,
            "decayAmount": 0.15,
            "sustainLevel": 0.25,
            "releaseTime": 1
        },
        "pitchEnv": {
            "attackTime": 0,
            "decayAmount": 0,
            "sustainLevel": 1,
            "releaseTime": 0
        }
    }
};

var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};