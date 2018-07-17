import React from 'react';

import OperatorModule from './OperatorModule.jsx';
import ProgrammingModule from './ProgrammingModule.jsx';
import VolumeModule from './VolumeModule.jsx';
import AnalyserModule from './AnalyserModule.jsx';
import ReverbModule from './ReverbModule.jsx';

class MainPanel extends React.Component {
  render () {

    const operators = ['A','B','C','D'];

    return [
        <OperatorModule operator="A" operators={operators} />,
        <OperatorModule operator="B" operators={operators} />,
        <OperatorModule operator="C" operators={operators} />,
        <OperatorModule operator="D" operators={operators} />,
        <ProgrammingModule />,
        <VolumeModule />,
        <AnalyserModule />,
        <ReverbModule />
    ];

  }
}

export default MainPanel;