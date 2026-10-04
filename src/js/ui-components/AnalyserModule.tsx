import React from "react";

export interface AnalyserModulePropsInterface {
    canvasRef: React.Ref<HTMLCanvasElement>;
}

class AnalyserModule extends React.Component<AnalyserModulePropsInterface>{
    render() {
        return (
            <fieldset className="cp-fieldset">
                <legend>Analyser</legend>
                <canvas ref={this.props.canvasRef} />
            </fieldset>
        );
    }
}

export default AnalyserModule;
