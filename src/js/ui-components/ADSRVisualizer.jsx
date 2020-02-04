import React from 'react';

class ADSRVisualizer extends React.Component {

    componentDidMount() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");

        canvas.width = 220;
        canvas.height = 110;

        const att = this.props.attackTime * canvas.height;
        let dec = this.props.decayAmount * canvas.height;
        let sus = this.props.sustainLevel * canvas.height;
        const rel = this.props.releaseTime * canvas.height;

        if(dec + sus > canvas.height){
            const diff = canvas.height / (dec + sus);
            dec *= diff;
            sus *= diff;
        }

        const susTime = (att + dec  + rel + 50 > canvas.width)? 50 : canvas.width - (att + dec  + rel);

        canvas.width = att + dec + susTime + rel;
        ctx.fillStyle = 'rgba(0, 20, 0, 1)';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        let region = new Path2D();
        region.moveTo(0,canvas.height);
        region.lineTo(att,canvas.height - (sus + dec));
        region.lineTo(att + dec,canvas.height - sus);
        region.lineTo(att + dec + susTime,canvas.height - sus);
        region.lineTo(att + dec + susTime + rel,canvas.height);
        region.closePath();
        ctx.fillStyle = 'rgb(0, 200, 0)';
        ctx.fill(region);
    }

    componentDidUpdate(){
        this.componentDidMount();
    }

  render () {
    return (
        <div className="cp-ADSRVisualizer">
            <canvas ref="canvas" width="220" height="110"></canvas>
        </div>
    );
}
}

export default ADSRVisualizer;