import React from 'react'

class ProjectorCalibration extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Projector Calibration</h3>
        </div>
        <div className='panel-body'>
          <div className="form-group">
            <label for="dpi">DPI:</label>
            <input type="number" className="form-control" id="dpi" value="" />
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectorCalibration
