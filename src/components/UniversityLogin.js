import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';

const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class UniversityLogin extends Component {

constructor(props){
  super(props);
 const {account, contractR, contractC, name, uid, email} = this.props;
 this.state = {
   nuid: '',
   buffer: null,
   certHash: ''
 };
 console.log('Contract R currently', {contractR})
 console.log('Contract C currently', {contractC})
}

handleChange = (e) => {
  let {name, value} = e.target;
  this.setState({ [e.target.name]: e.target.value });
};

captureFile = (event) => {
  event.preventDefault()
  //Process file for IPFS...
  const file = event.target.files[0]
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
    this.setState({ buffer: Buffer(reader.result) })
    // console.log('buffer', Buffer(reader.result))
    console.log('current Buffer state: ', this.state.buffer)
  }
    console.log('file captured...')
}

//Example: "QmPjnv3hEHX3qWP8BVNY1rWQaKsGAtDPDNGc5GfAxsxhtC"
//URL: https://ipfs.infura.io/ipfs/QmPjnv3hEHX3qWP8BVNY1rWQaKsGAtDPDNGc5GfAxsxhtC
onSubmit = (event) => {
  event.preventDefault()
  console.log("Submitting the form...")
  const { account, contractR, contractC, ...props} = this.props;
  ipfs.add(this.state.buffer, (error, result) => {
    console.log('Ipfs result: ', result)
    const certHash = result[0].hash
    this.setState({certHash})
    console.log('CertHash: ', this.state.certHash)
    console.log("New UID: ", this.state.nuid)
    if(error) {
      console.error(error)
      return
    }
    //Step 2: Store the file on blockchain
    this.setState({contractR})
    this.setState({contractC})
    this.setState({account})
      this.props.contractC.methods.Upload (
      this.state.nuid,
      certHash
      ).send({from: this.props.account}, (err, txHash) => {
      console.log(txHash);
    })
    {/* console.log('Contract C in UL:', {contractC})
      const globalCertCount = await contractC.methods.globalCertCount().call()
      console.log("Global Cert Count: ", globalCertCount.toNumber())
      for (var j = 1; j<= globalCertCount; j++) {
        const certificate = await contractC.methods.certificates(j).call()
        this.setState({
          certificates: [...this.state.certificates, certificate]
        })
      } console.log('Certificates: ', this.state.certificates) */}
  })
}


render() {
return (
  <div className = "back" >
        <div className="sidebar mt-5">
          <ul>
              <li><a className="nav-link px-3">
                  <i className="material-icons icon">
                    person
                  </i>
                  <span className="text">User Profile</span>
                </a></li>
              <li><a className="nav-link px-3">
                  <i className="material-icons icon">
                    publish
                  </i>
                  <span className="text">Upload Certificate</span>
                </a></li>
              <li><a className="nav-link px-3">
                  <i className="material-icons icon">
                    exit_to_app
                  </i>
                  <span className="text">Log Out</span>
                </a></li>
          </ul>
      </div>

      <div className="container-fluid mt-5">
          <div className="row">
              <main role="main" className="col-lg-50 d-flex text-center">

                  <div className="content mr-auto ml-auto"><center>
                      <h1><center>Profile</center></h1>
                      <div>
                            <form name="a">
                            <div>
                                <h5> Name: </h5><label><h6>{this.props.name}</h6></label>
                            </div>
                            <br/>
                            <div>
                              <h5> Email: </h5> <label><h6>{this.props.email}</h6></label>
                            </div>
                            <br/>
                            <div>
                                <h5> UID: </h5><label><h6>{this.props.uid}</h6></label>
                            </div>
                            </form>
                      </div>
                      </center>
                  </div>
              </main>
            </div>


            <div className="row">
              <main role="main" className="col-lg-100">
                  <div id="content"><center>
                      <h1><center>Upload Certificate</center></h1>
                      <div>
                          <br/>
                          <form name="b" >
                              <div>
                                  Student UID  <input type="text" name= "nuid" className="form-b" onChange={this.handleChange.bind(this)}  required/>
                              </div>
                              <br/>
                              <div>
                                  Select Certificate  <input type="file" name="cid" className="form-b" onChange = {this.captureFile.bind(this)} required/>
                              </div>
                              <br/>
                              <div>
                                  <center><button id="snd" type="submit" onClick = {this.onSubmit.bind(this)}>Upload Certificate</button></center> <br/>
                              </div>
                              <div>
                                  <img src = {`https://ipfs.infura.io/ipfs/${this.state.certHash}`}/> <br/>
                              </div>
                          </form>
                      </div>
                      </center>
                  </div>

              </main>
          </div>
        </div>
      </div>
      );
    }


}

export default UniversityLogin;
