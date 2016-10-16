import React from 'react'

import fetch from 'node-fetch'

class ModelList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {list: []}
    fetch('http://localhost:3000/api/models')
    .then(response => response.json())
    .then(function (json) { this.setState({list: json}) }.bind(this))
  }
  render () {
    var nodes = this.state.list.map(function (model) { return <Model name={model.name} /> })
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
          <p><button className='btn btn-block btn-primary' onClick={this.handleClick}>Print</button></p>
        </div>
      </div>
    )
  }

  handleClick () {
    fetch('http://localhost:3000/api/jobs?resin=0&file=0', {method: 'POST'})
    .then(response => response.json())
    .then(function (json) { this.setState({list: json}) }.bind(this))
  }
}

class Resins extends React.Component {
  constructor (props) {
    super(props)
    this.state = {list: []}
    fetch('http://localhost:3000/api/resins')
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
