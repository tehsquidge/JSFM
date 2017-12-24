var voicePool = new VoicePool(ac);
var analyser = new Analyser(ac);

voicePool.output.connect(analyser.analyser);

analyser.connect(ac.destination);

analyser.drawLoop();

//controls

var applyConfig = function(){
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
                'sustainLevel': parseFloat(opConf.querySelector('.sustainLevel').value),
                'releaseTime': parseFloat(opConf.querySelector('.releaseTime').value)
            }        
        }
    });
    voicePool.configure(configuration);
}
applyConfig();
document.querySelector('#apply').addEventListener('click',function(e){ e.preventDefault(); applyConfig();  });
document.querySelector('#gateOn').addEventListener('click',function(e){ e.preventDefault(); voicePool.keyDown(440);  });
document.querySelector('#gateOff').addEventListener('click',function(e){ e.preventDefault(); voicePool.keyUp(440);  });
