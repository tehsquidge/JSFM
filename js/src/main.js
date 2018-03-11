var voicePool = new VoicePool(ac);
var analyser = new Analyser(ac);
var reverb = new Reverb(ac);


domReady(function() {

    voicePool.output.connect(analyser.analyser);

    analyser.connect(reverb.convolver);

    reverb.connect(ac.destination);

    analyser.drawLoop();

    //midi
    midiController = new MidiInputDevice(voicePool);

    var midiRefresh = function(){
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(
                function(midi){ //success
                    console.log('Got midi!', midi);
                    MidiDevices = midi.inputs;
                    var selectMIDI = document.querySelector('#midiSelect');
                    while (selectMIDI.options.length > 0) {                
                        selectMIDI.remove(0);
                    } 
                    for(let [i,input] of MidiDevices.entries()) {
                            var option = document.createElement("option");
                            option.text = input.name;
                            option.value = i;
                            selectMIDI.appendChild(option);
                    }
                    midiApply();
                },
                function(){ //failure
                    console.log('could not get midi devices');
                }
            );
        }else{
            console.log('no MIDI support');
        }
    }
    midiRefresh();

    var midiApply = function() {
        var deviceID = document.querySelector('#midiSelect').value;
        midiController.input = MidiDevices.get(deviceID);
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
                'ampEnv': {
                    'attackTime': parseFloat(opConf.querySelector('.ampEnv .attackTime').value),
                    'decayAmount': parseFloat(opConf.querySelector('.ampEnv .decayAmount').value),
                    'sustainLevel': parseFloat(opConf.querySelector('.ampEnv .sustainLevel').value),
                    'releaseTime': parseFloat(opConf.querySelector('.ampEnv .releaseTime').value)
                },
                'pitchEnv': {
                    'attackTime': parseFloat(opConf.querySelector('.pitchEnv .attackTime').value),
                    'decayAmount': parseFloat(opConf.querySelector('.pitchEnv .decayAmount').value),
                    'sustainLevel': parseFloat(opConf.querySelector('.pitchEnv .sustainLevel').value),
                    'releaseTime': parseFloat(opConf.querySelector('.pitchEnv .releaseTime').value)
                }        
            }
        });
        return configuration;
    }

    var presetApply = function(config){
        voicePool.configure(config);
    }
    presetApply(getConfig());

    var presetReset = function(config,autoapply){
        document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
            opConf.querySelector('.connectsTo option[value='+config[opConf.dataset.operator].connectsTo+']').selected = true;
            opConf.querySelector('.waveType').value = config[opConf.dataset.operator].waveType;
            opConf.querySelector('.ratio').value = config[opConf.dataset.operator].ratio;
            opConf.querySelector('.detune').value = config[opConf.dataset.operator].detune;
            opConf.querySelector('.modulationFactor').value = config[opConf.dataset.operator].modulationFactor;
            opConf.querySelector('.ampEnv .attackTime').value = config[opConf.dataset.operator].ampEnv.attackTime;
            opConf.querySelector('.ampEnv .decayAmount').value = config[opConf.dataset.operator].ampEnv.decayAmount;
            opConf.querySelector('.ampEnv .sustainLevel').value = config[opConf.dataset.operator].ampEnv.sustainLevel;
            opConf.querySelector('.pitchEnv .releaseTime').value = config[opConf.dataset.operator].ampEnv.releaseTime;
            opConf.querySelector('.pitchEnv .attackTime').value = config[opConf.dataset.operator].pitchEnv.attackTime;
            opConf.querySelector('.pitchEnv .decayAmount').value = config[opConf.dataset.operator].pitchEnv.decayAmount;
            opConf.querySelector('.pitchEnv .sustainLevel').value = config[opConf.dataset.operator].pitchEnv.sustainLevel;
            opConf.querySelector('.pitchEnv .releaseTime').value = config[opConf.dataset.operator].pitchEnv.releaseTime;
        });
        if(autoapply){
            presetApply(config);
        }else{
            document.querySelector('#presetApply').classList.add('attention');
        }
    }
    presetReset(defaultPreset,true);

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
            presetReset(config);
        };
        reader.readAsText(file);
      }

    var applyReverbConfig = function(){
        var reb = document.querySelector('#controller fieldset.reverb');
        reverb.configure({
            'wet':  parseFloat(reb.querySelector('.wet').value),
            'dry':  parseFloat(reb.querySelector('.dry').value),
            'seconds':  parseFloat(reb.querySelector('.seconds').value),
            'decay':  parseFloat(reb.querySelector('.decay').value),
            'reverse':  parseInt(reb.querySelector('.reverse').value)
        });
    }
    applyReverbConfig();

    document.querySelector('#presetApply').addEventListener('click',function(e){ e.preventDefault(); presetApply(getConfig()); this.classList.remove('attention');  });
    document.querySelector('#presetReset').addEventListener('click',function(e){ e.preventDefault(); presetReset(defaultPreset); });
    document.querySelector('#presetLoad').addEventListener('change',loadPreset );
    document.querySelector('#presetSave').addEventListener('click',function(e){ e.preventDefault(); saveConfig();  });

    document.querySelector('#midiApply').addEventListener('click',function(e){ e.preventDefault(); midiApply(); this.classList.remove('attention'); });
    document.querySelector('#midiRefresh').addEventListener('click',function(e){ e.preventDefault(); midiRefresh(); });

    document.querySelector('#reverbApply').addEventListener('click',function(e){ e.preventDefault(); applyReverbConfig(); this.classList.remove('attention'); });

    document.querySelectorAll('.operator input, .operator button, .operator select').forEach(
        e=> { e.addEventListener('change',
            e => {
                document.querySelector('#presetApply').classList.add('attention');
            }
        ); 
       } 
    ) ;

    document.querySelector('#midiSelect').addEventListener('change', e=> {
        document.querySelector('#midiApply').classList.add('attention');        
    });
    
    document.querySelectorAll('fieldset.reverb input, fieldset.reverb select').forEach(
        e=> { e.addEventListener('change',
            e => {
                document.querySelector('#reverbApply').classList.add('attention');
            }
        ); 
       } 
    ) ;

});