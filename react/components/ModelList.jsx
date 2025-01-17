import React from 'react'

class ModelList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {list: []}
    fetch('/api/models')
    .then(response => response.json())
    .then(function (json) { this.setState({list: json}) }.bind(this))
  }
  render () {
    var nodes = this.state.list.map(function (model) { return <Model name={model.name} file={model.file} /> })
    return (
      <div>
        {nodes}
      </div>
    )
  }
}

class Model extends React.Component {
  render () {
    return (
      <div className='panel panel-primary'>
        <div className='panel-heading'>
          <h3 className='panel-title'>{this.props.name}</h3>
        </div>
        <div className='panel-body'>
          <p><Resins /></p>
          <p><button className='btn btn-block btn-primary' onClick={this.handleClick.bind(this)}>Print</button></p>
        </div>
      </div>
    )
  }

  handleClick () {
    fetch('/api/jobs?resin=0&file=' + this.props.file, {method: 'POST'})
    .then(response => response.json())
    .then(function (json) { this.setState({list: json}) }.bind(this))
  }
}

class Resins extends React.Component {
  constructor (props) {
    super(props)
    this.state = {list: []}
    fetch('/api/resins')
    .then(response => response.json())
    .then(function (json) { this.setState({list: json}) }.bind(this))
  }
  render () {
    var options = this.state.list.map(function (resin) { return <option name={resin.id}>{resin.name}</option> })
    return (
      <select className="form-control">{options}</select>
    )
  }
}

export default ModelList
