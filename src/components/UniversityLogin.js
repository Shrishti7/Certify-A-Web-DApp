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
 const {account, contractR, name, uid, email} = this.props;
 this.state = {
   nuid: '',
   buffer: null,
   certHash: '',
   certs: []
 };
 console.log('Contract R currently', {contractR})
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
onSubmit = async (event) => {
  event.preventDefault()
  console.log("Submitting the form...")
  const { account, contractR, certificates, ...props} = this.props;
  this.setState({contractR})
  this.setState({account})
  this.setState({certificates})
  var j = 0
  const registrationCount = await contractR.methods.registrationCount().call()
  for (var i = 1; i<= registrationCount; i++) {
    const registration = await contractR.methods.students(i).call()
    const user_profile = registration[1]
    const user_uid = registration[2]

    if((user_uid===this.state.nuid)&&(user_profile !== "University"))
    {
      j = j+1;
    }
  }
    if(j === 1){

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
          this.props.contractR.methods.Upload (
          this.state.nuid,
          certHash
          ).send({from: this.props.account}, (err, txHash) => {
          console.log(txHash);
        })
      })
      this.setState({certificates})
    }
    else {
      window.alert("Please enter a valid Student UID")
      return
    }
}


render() {
return (
  <div className = "back" >
        <div className="sidebar">
          <ul>
              <li><a className="nav-link px-3" href = "#prof">
                  <i className="material-icons icon">
                    person
                  </i>
                  <span className="text">User Profile</span>
                </a></li>
              <li><a className="nav-link px-3" href= "#upload-cert">
                  <i className="material-icons icon">
                    publish
                  </i>
                  <span className="text">Upload Certificate</span>
                </a></li>
                <li><a className="nav-link px-3" href= "#uploaded">
                    <i className="material-icons icon">
                      publish
                    </i>
                    <span className="text">Uploaded Certificate</span>
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
          <div className="row" id = "prof">
              <main role="main" className="col-lg-50 d-flex text-center">

                  <div className="content mr-auto ml-auto"><center>
                      <h1><center>Profile</center></h1>
                      <div>
                            <form name="a">
                            <div>
                                Name: <label>{this.props.name}</label>
                            </div>
                            <br/>
                            <div>
                              Email: <label>{this.props.email}</label>
                            </div>
                            <br/>
                            <div>
                                UID: <label>{this.props.uid}</label>
                            </div>
                            </form>
                      </div>
                      </center>
                  </div>
              </main>
            </div>


            <div className="row" id="upload-cert">
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
                          </form>

                      </div>
                      </center>
                  </div>

              </main>
          </div>

          <div className="row" id="uploaded">
            <main role="main" className="col-lg-100">
                <div id="content"><center>
                        <div>
                        <h1><center>Uploaded Certificates</center></h1>
                        <ul id="certList" className="list-unstyled">
                         {this.props.certificates.map((certificate, key) => {
                           return (
                             <div className = "certTemplate" key = {key}>
                             <label>
                               <span className = "content"> Cert Count: {key+1}<br/> </span>
                               <span className = "content"> UID: {certificate.uid}<br/> </span>
                               <span className = "content"> Certificate Hash:{certificate.certHash}<br/> </span>
                               <span className = "content"> Certificate: <img src = {`https://ipfs.infura.io/ipfs/${certificate.certHash} `}/><br/> </span>
                                 <br/>
                             </label>
                             </div>
                           )
                         })}
                        </ul>
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
