import React from 'react'
import ButtonToolbar from 'react-bootstrap/lib/Button';
import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import Table from 'react-bootstrap/lib/Table';

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
        border: '1px solid black',
        height: '200px'
      }
      var btn_margin = {
        'margin-right': '5px'
      }
      return (
         <div>
           <Grid>
             <Row className="show-grid">
               <Col md={6} mdPush={6}>
                 <div>
                here comes upload
                 </div>
               </Col>

              <Col md={6} mdPull={6}>
                <div style={image_border}>
                  <Image src="../../static/images/slice_example.png" />
                  here comes image
                </div>
                <p><strong>Printing job status:</strong></p>
                <Fetch url="http://localhost:3000/api/status">
                  <TestComponent/>
                </Fetch>

                <ButtonToolbar>
                  <Button bsStyle="danger" style={btn_margin}>Stop Print</Button>
                  <Button bsStyle="primary" style={btn_margin}>Pause Print</Button>
                </ButtonToolbar>
              </Col>

             </Row>
           </Grid>
         </div>
      );
   }
}

class TestComponent extends React.Component{
  render(){
    console.log(this.props.type)
    return (
      <div>
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
