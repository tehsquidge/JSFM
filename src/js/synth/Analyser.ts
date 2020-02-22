class Analyser {

    private _analyser: AnalyserNode;
    private _width: number;
    private _height: number;
    private _canvasCtx: CanvasRenderingContext2D;
    private _canvas: HTMLCanvasElement;

    constructor(ac: AudioContext) {
        this._analyser = ac.createAnalyser();
        this._analyser.fftSize = 512;
        this._width = 200;
        this._height = 200;
        this.setCanvas(document.createElement('canvas'));
    }

    get input(){
        return this._analyser;
    }

    connect(a: AudioNode){
        this.disconnect();
        this._analyser.connect(a);
    }

    disconnect(){
        this._analyser.disconnect();
    }

    draw(){
        const bufferLength = this._analyser.fftSize;

        const dataArray = new Uint8Array(bufferLength);

        this._analyser.getByteTimeDomainData(dataArray);

        this._canvasCtx.fillStyle = 'rgba(0, 20, 0, 1)';
        this._canvasCtx.fillRect(0, 0, this._width, this._height);

        this._canvasCtx.lineWidth = 1;
        this._canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
        this._canvasCtx.beginPath();
        const sliceWidth = (this._width * 1.0 / bufferLength);
        let x = 1;

        for (let i = 0; i < bufferLength; i++) {

            const v = dataArray[i] / 128.0;
            const y = v * this._height / 2;

            if (i === 0) {
                this._canvasCtx.moveTo(x, y);
            } else {
                this._canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this._canvasCtx.lineTo(this._width + 1, this._height + 1);
        this._canvasCtx.stroke();
    }

    drawLoop() {
        this.draw();
        requestAnimationFrame(this.drawLoop.bind(this));
    }

    setCanvas(cnvs: Element) {
        this._canvas = cnvs as HTMLCanvasElement;
        this._canvasCtx = this._canvas.getContext("2d");
        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }
    
}

export default Analyser;