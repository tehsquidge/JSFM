import React from 'react';

import { EnvelopeInterface } from "../types/Preset";

class ADSRVisualizer extends React.Component<EnvelopeInterface> {

    componentDidMount() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        canvas.width = 220;
        canvas.height = 110;

        const att = this.props.attackTime * canvas.height;
        let dec = this.props.decayTime * canvas.height;
        let sus = this.props.sustainLevel * canvas.height;
        const rel = this.props.releaseTime * canvas.height;

        const susTime = (att + dec  + rel + 50 > canvas.width)? 50 : canvas.width - (att + dec  + rel);

        canvas.width = att + dec + susTime + rel;
        ctx.fillStyle = 'rgba(0, 20, 0, 1)';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        let region = new Path2D();
        region.moveTo(0,canvas.height);
        region.lineTo(att,0);
        region.lineTo(att + dec,canvas.height - sus);
        region.lineTo(att + dec + susTime,canvas.height - sus);
        region.lineTo(att + dec + susTime + rel,canvas.height);
        region.closePath();
        ctx.strokeStyle = 'rgba(0, 200, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgb(0, 200, 0)';
        ctx.fill(region);
        ctx.stroke(region);
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