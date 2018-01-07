function Analyser(ac){
    this._analyser = ac.createAnalyser();
    this._analyser.fftSize = 512;
    this._canvas = document.createElement('canvas');
    this._canvasCtx = this._canvas.getContext("2d");
    this._width = 200;
    this._height = 200;
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    document.body.append(this._canvas);
}

Analyser.prototype = Object.create(null,{
    constructor: {
        value: Analyser
    },
    analyser: {
        get: function(){
            return this._analyser;
        }
    },
    connect: {
        value: function(a){
            this.disconnect();
            this._analyser.connect(a);
        }
    },
    disconnect: {
        value: function(){
            this._analyser.disconnect();
        }
    },
    draw: {
        value: function(){
            var bufferLength = this._analyser.fftSize;

            var dataArray = new Uint8Array(bufferLength);

            this._analyser.getByteTimeDomainData(dataArray);
                        
            this._canvasCtx.fillStyle = 'rgba(0, 20, 0, .4)';
            this._canvasCtx.fillRect(0, 0, this._width, this._height);
            
            this._canvasCtx.lineWidth = 1;
            this._canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
            this._canvasCtx.beginPath();
            var sliceWidth = (this._width * 1.0  / bufferLength);
            var x =1;

            for(var i = 0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * this._height/2;
        
                if(i === 0) {
                  this._canvasCtx.moveTo(x, y);
                } else {
                  this._canvasCtx.lineTo(x, y);
                }
        
                x += sliceWidth;
            }
        
              this._canvasCtx.lineTo(this._width+1, this._height+1);
              this._canvasCtx.stroke();  

        }
    },
    drawLoop: {
        value: function(){
            this.draw();
            requestAnimationFrame(this.drawLoop.bind(this));
        }
    }
});