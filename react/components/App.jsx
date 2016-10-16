import React from 'react'
import ButtonToolbar from 'react-bootstrap/lib/Button';
import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import Table from 'react-bootstrap/lib/Table';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

import Fetch from 'react-fetch';

class App extends React.Component {
  render () {
    return (
      <div>
        <Header/>
        <Content/>
      </div>
    )
  }
}

class Header extends React.Component {
    render() {
      return (
         <div>
           <Navbar inverse>
             <Navbar.Header>
               <Navbar.Brand>
                 <a href="#">POCE</a>
               </Navbar.Brand>
             </Navbar.Header>
           </Navbar>
         </div>
      );
   }
}

class Content extends React.Component {

   render() {
      var image_border = {
        'height': '300px',
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto'
      }
      var btn_margin = {
        'margin-right': '5px',
        'margin-top': '5px'
      }
      var progress_bar = {
        'margin': '5px'
      }
      var files_list = {
        'height': '266px',
        'width': '400px',
        'margin-left': 'auto',
        'margin-right': 'auto'
      }

      const now = 60;
      return (
         <div>
           <Grid>
             <Row className="show-grid">
               <Col md={6} mdPush={6}>
                 <div>
                    <p><strong>Files on server:</strong></p>
                    <select class="form-control" multiple style={files_list}>
                      <option>gear1.svg</option>
                      <option>calibration_cube.svg</option>
                      <option>geared-cube.svg</option>
                    </select>
                 </div>

                 <div>
                    <button className="btn btn-primary" onClick={this.handleUpload} style={btn_margin}>Upload .svg</button>
                 </div>
               </Col>

              <Col md={6} mdPull={6}>
                <div>
                  <Image style={image_border} src="/images/slice_example.png" responsive />
                  <ProgressBar now={now} label={`${now}%`} style={progress_bar} striped active/>
                  <p><strong>Printing job status:</strong></p>
                </div>

                <div>
                    <button className="btn btn-danger" onClick={this.handleStop} style={btn_margin}>Stop Print</button>
                    <button className="btn btn-primary" type="submit" style={btn_margin}>Pause Print</button>
                </div>

                <Fetch url="http://localhost:3000/api/status">
                  <TestComponent/>
                </Fetch>


              </Col>

             </Row>
           </Grid>
         </div>
      );
   }

   handleStop() {
     fetch('http://localhost:3000/api/cancelCurrentJob')
     .then(function(response){
     	return response.json();
     })
     .then(function(json){
      console.log("printing canceled");
     	console.log(json);
     });
   }
}

// class LoadSlice extends React.Component {
//   render() {
//     console.log(this.prop);
//     return(
//       <div>
//         //<Image src="this.prop" />
//       </div>
//     );
//   }
// }

class TestComponent extends React.Component{
  render(){

    var job_status_container = {
      'margin-top': '20px'
    }

    return (
      <div style={job_status_container}>
        <Table striped bordered condensed hover>
           <tbody>
             <tr>
               <td>Type</td>
               <td>{this.props.type}</td>
             </tr>
             <tr>
               <td>Current Layer</td>
               <td>{this.props.currentLayer}</td>
             </tr>
             <tr>
               <td>Total Layer</td>
               <td>{this.props.totalLayer}</td>
             </tr>
             <tr>
               <td>Time Left</td>
               <td>{this.props.timeLeft}</td>
             </tr>
             <tr>
               <td>Time Total</td>
               <td>{this.props.timeTotal}</td>
             </tr>
             <tr>
               <td>Shutter Position</td>
               <td>{this.props.shutterPos}</td>
             </tr>
             <tr>
               <td>z Position</td>
               <td>{this.props.z_position}</td>
             </tr>
             <tr>
               <td>Current Job</td>
               <td>{this.props.currentJob}</td>
             </tr>
           </tbody>
         </Table>
     </div>
   );
  }
}

export default App;
