function Analyser(ac){
    this._analyser = ac.createAnalyser();
    this._canvas = document.createElement('canvas');
    this._canvasCtx = this._canvas.getContext("2d");
    this._width = 100;
    this._height = 100;
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
            var timeData = new Uint8Array(this._analyser.frequencyBinCount);
            var scaling = this._height / 256;
            var risingEdge = 0;
            var edgeThreshold = 5;
            
            this._analyser.getByteTimeDomainData(timeData);
            
            this._canvasCtx.fillStyle = 'rgba(0, 20, 0, .25)';
            this._canvasCtx.fillRect(0, 0, this._width, this._height);
            
            this._canvasCtx.lineWidth = 1;
            this._canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
            this._canvasCtx.beginPath();
            
            // No buffer overrun protection
            while (timeData[risingEdge++] - 128 > 0 && risingEdge <= this._width)
                if (risingEdge >= this._width) risingEdge = 0;
            
            while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= this._width)
                if (risingEdge >= this._width) risingEdge = 0;
            
            for (var x = risingEdge; x < timeData.length && x - risingEdge < this._width; x++)
                this._canvasCtx.lineTo(x - risingEdge, this._height - timeData[x] * scaling);
            
            this._canvasCtx.stroke();
        }
    },
    drawLoop: {
        value: function(){
            this._draw();
            requestAnimationFrame(this._drawLoop);
        }
    }
});