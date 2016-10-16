import React from 'react'

import PrinterStatus from './PrinterStatus.jsx'
import ModelList from './ModelList.jsx'

class App extends React.Component {
  render () {
    return (
      <div className='container'>
        <PrinterStatus></PrinterStatus>
        <p>
          <button className='btn btn-block btn-danger' onClick={this.handleCancel}>Cancel</button>
        </p>
        <ModelList></ModelList>
      </div>
    )
  }

  handleCancel () {
    fetch('http://localhost:3000/api/cancelCurrentJob', {method: 'POST'})
  }
}

export default App
