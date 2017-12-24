var voice = new Voice(ac);

voice.output.connect(ac.destination);

//controls

var applyConfig = function(){
    var configuration = {};
    document.querySelectorAll('#controller fieldset.operator').forEach(opConf => {
        configuration[opConf.dataset.operator] = {
            'connectsTo': opConf.querySelector('.connectsTo').value,
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
    voice.configure(configuration);
}
applyConfig();
document.querySelector('#apply').addEventListener('click',function(e){ applyConfig(); e.preventDefault() });
document.querySelector('#gateOn').addEventListener('click',function(e){ voice.gateOn(); e.preventDefault() });
document.querySelector('#gateOff').addEventListener('click',function(e){ voice.gateOff(); e.preventDefault() });
