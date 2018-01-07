domReady(function() {

    var voicePool = new VoicePool(ac);
    var analyser = new Analyser(ac);

    voicePool.output.connect(analyser.analyser);

    analyser.connect(ac.destination);

    analyser.drawLoop();

    //midi

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
            .then(
            function(midi){ //success
                console.log('Got midi!', midi);
                MidiDevices = midi;
                var inputs = MidiDevices.inputs.values();
                var outputs = MidiDevices.outputs.values();
                for (var input = inputs.next();
                     input && !input.done;
                     input = inputs.next()) {
              
                        var midiController = new MidiInputDevice(voicePool);
                        midiController.input = input.value;
                    

                }
            },
            function(){ //failure
                console.log('could not get midi devices');
            }
        );
    }else{
        console.log('no MIDI support');
    }


    //controls

    var getConfig = function(){
        var configuration = {};
        document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
            configuration[opConf.dataset.operator] = {
                'connectsTo': opConf.querySelector('.connectsTo').value,
                'waveType': opConf.querySelector('.waveType').value,
                'ratio': parseFloat(opConf.querySelector('.ratio').value),
                'detune': parseFloat(opConf.querySelector('.detune').value),
                'modulationFactor': parseFloat(opConf.querySelector('.modulationFactor').value),
                'envelope': {
                    'attackTime': parseFloat(opConf.querySelector('.attackTime').value),
                    'decayAmount': parseFloat(opConf.querySelector('.decayAmount').value),
                    'sustainLevel': parseFloat(opConf.querySelector('.sustainLevel').value),
                    'releaseTime': parseFloat(opConf.querySelector('.releaseTime').value)
                }        
            }
        });
        return configuration;
    }

    var applyConfig = function(){
        voicePool.configure(getConfig());
    }
    applyConfig();

    var saveConfig = function(){
        var data = getConfig();    
        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }
    
        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
    
        a.download = 'preset.json'
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)  
    }

    var loadPreset = function(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var config = JSON.parse(e.target.result);
            document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
                opConf.querySelector('.connectsTo').value = config[opConf.dataset.operator].connectsTo;
                opConf.querySelector('.waveType').value = config[opConf.dataset.operator].waveType;
                opConf.querySelector('.ratio').value = config[opConf.dataset.operator].ratio;
                opConf.querySelector('.detune').value = config[opConf.dataset.operator].detune;
                opConf.querySelector('.modulationFactor').value = config[opConf.dataset.operator].modulationFactor;
                opConf.querySelector('.attackTime').value = config[opConf.dataset.operator].envelope.attackTime;
                opConf.querySelector('.decayAmount').value = config[opConf.dataset.operator].envelope.decayAmount;
                opConf.querySelector('.sustainLevel').value = config[opConf.dataset.operator].envelope.sustainLevel;
                opConf.querySelector('.releaseTime').value = config[opConf.dataset.operator].envelope.releaseTime;
            });
        };
        reader.readAsText(file);
      }

    document.querySelector('#apply').addEventListener('click',function(e){ e.preventDefault(); applyConfig();  });
    document.querySelector('#loadPreset').addEventListener('change',loadPreset );
    document.querySelector('#savePreset').addEventListener('click',function(e){ e.preventDefault(); saveConfig();  });    
    document.querySelector('#gateOn').addEventListener('click',function(e){ e.preventDefault(); voicePool.keyDown(440);  });
    document.querySelector('#gateOff').addEventListener('click',function(e){ e.preventDefault(); voicePool.keyUp(440);  });




});