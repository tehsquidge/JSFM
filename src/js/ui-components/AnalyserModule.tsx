import React from "react";

class AnalyserModule extends React.Component{
    render() {
        return (
            <fieldset className="cp-fieldset">
                <legend>Analyser</legend>
                <canvas ref="analyserCanvas" />
            </fieldset>
        );
    }
}

export default AnalyserModule;
