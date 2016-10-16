import React from 'react'

import fetch from 'node-fetch'

class PrinterStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {currentImage: 'http://localhost:3000/api/projector/currentImage'}
    setInterval(function () {
      fetch('http://localhost:3000/api/status')
      .then(response => response.json())
      .then(function (json) { this.setState(json) }.bind(this))
    }.bind(this), 200)
    setInterval(function () {
      this.setState({currentImage: 'http://localhost:3000/api/projector/currentImage?' + Math.random()})
    }.bind(this), 2000)
  }
  render () {
    var progressBarClass = 'progress-bar progress-bar' + (this.state.type === 'IDLE' ? '' : '-striped active')
    return (
      <div>
        <div className='row'>
          <div className='col-xs-8'><img id='currentImage' className='img-rounded' src={this.state.currentImage}></img><br /><br /></div>
          <div className='col-xs-4'>
            <p>Status: {this.state.type}</p>
            <p>Layer: {this.state.currentLayer}/{this.state.totalLayer}</p>
          </div>
        </div>
        <div className='progress'>
          <div className={progressBarClass} style={{width: (this.state.progress * 100) + '%'}}>
          </div>
        </div>
      </div>
    )
  }
}

export default PrinterStatus
