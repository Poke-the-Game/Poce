import React from 'react'

import PrinterStatus from './PrinterStatus.jsx'
import ModelList from './ModelList.jsx'
import ProjectorCalibration from './ProjectorCalibration.jsx'

class App extends React.Component {
  render () {
    return (
      <div className='container'>
        <h1>Poce</h1>
        <PrinterStatus></PrinterStatus>
        <p>
          <button className='btn btn-block btn-danger' onClick={this.handleCancel}>Cancel</button>
        </p>
        <ModelList />
        <ProjectorCalibration />
      </div>
    )
  }

  handleCancel () {
    fetch('/api/cancelCurrentJob', {method: 'POST'})
  }
}

export default App
