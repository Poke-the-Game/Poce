import React from 'react'

class ProjectorCalibration extends React.Component {
  constructor (props) {
    super(props)
    this.state = {dpi: 0}
    fetch('/api/projector')
    .then(response => response.json())
    .then(function (json) { this.setState(json) }.bind(this))
  }
  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Projector Calibration</h3>
        </div>
        <div className='panel-body'>
          <div className='form-group'>
            <label >DPI:</label>
            <input type='number' className='form-control' id='dpi' value={this.state.dpi} onChange={this.handleChange.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
  handleChange (event) {
    let dpi = event.target.value
    this.setState({dpi: dpi})
    fetch('/api/projector?showPattern=1&dpi=' + dpi, {method: 'PUT'})
  }
}

export default ProjectorCalibration
