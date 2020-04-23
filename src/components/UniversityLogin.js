import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert';

const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class UniversityLogin extends Component {

constructor(props){
  super(props);
 const {account, contractR, name, uid, email, profile} = this.props;
 this.state = {
   nuid: '',
   buffer: null,
   certHash: '',
   certs: [],
   searchId: '',
   uploader: ''
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

logout = async() => {
  window.location.reload()
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
        swal("Yay!", "Certificate added to the IPFS", "success");
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
      swal("Oops!", "Please enter a valid Student UID", "error");
      return
    }
}


onSearch = async(event) => {
  event.preventDefault()
  this.setState({searchId: this.state.searchId})
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
                  <span className="text">Profile</span>
                </a></li>
              <li><a className="nav-link px-3" href= "#upload-cert">
                  <i className="material-icons icon">
                    publish
                  </i>
                  <span className="text">Upload Certificate</span>
                </a></li>
                <li><a className="nav-link px-3" href= "#search-cert">
                    <i className="material-icons icon">
                      pageview
                    </i>
                    <span className="text">Search Certificate</span>
                  </a></li>
                <li><a className="nav-link px-3" href= "#uploaded">
                    <i className="material-icons icon">
                      description
                    </i>
                    <span className="text">Uploaded Certificate</span>
                  </a></li>
              <li><a className="nav-link px-3">
                  <i className="material-icons icon">
                    exit_to_app
                  </i>
                  <span className="text" onClick = {this.logout.bind(this)} >Log Out</span>
                </a></li>
          </ul>
      </div>

      <div className="container-fluid mt-5">
          <div className="row" id = "prof">
              <main role="main" className="col-lg-50 d-flex text-center">

                  <div className="content mr-auto ml-auto"><center>
                      <h1><center>University Profile</center></h1>
                      <br/>
                      <div className="fa">
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
                      <br/>
                      </center>
                  </div>
              </main>
            </div>
            <hr/>

            <div className="row" id="upload-cert">
              <main role="main" className="col-lg-100">
                  <div id="content"><center>
                      <h1><center>Upload Certificate</center></h1>
                      <div >
                          <br/>
                          <form name="a" >
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
                       <br/>
                     </center>
                   </div>
                 </main>
             </div>
             <hr/>

             <div className="row" id="search-cert">
               <main role="main" className="col-lg-100">
                   <div id="content"><center>
                       <h1><center>Search Certificate</center></h1>
                       <div >
                           <br/>
                           <form name="a" >
                             <div>
                                 Student UID  <input type="text" name= "searchId" className="form-b" onChange={this.handleChange.bind(this)}  required/>
                             </div>
                             <br/>
                            {/* <div>
                                 <center><button id="snd" type="submit" onClick = {this.onSearch.bind(this)}>Search Certificate</button></center> <br/>
                             </div> */}
                           </form>
                           <ul id="certList" className="list-unstyled">
                            {this.props.certificates.map((certificate, key) => {
                              if(this.props.account === certificate.uploader) {
                                if(this.state.searchId === certificate.uid) {
                                  return (
                                    <div>
                                        <div className = "cert-template" key = {key}>
                                            <div className="theCard">
                                              <div className = "theFront">
                                                  <img className="image" src = {`https://ipfs.infura.io/ipfs/${certificate.certHash}`}/>
                                              </div>
                                              <div className="theBack">
                                                 <p> Certificate Count: {key+1}<br/>
                                                   Student UID: {certificate.uid}<br/>
                                                   Certificate Hash: {certificate.certHash}<br/>
                                                   Uploaded By: {this.props.name}</p>
                                                 <button type="button" class="btn btn-success" onClick={() => {
                                                     if(this.props.profile==="University"){
                                                       swal("Certificate Verified!", `${this.props.name}`, "success");
                                                     }
                                                 }}>Verify </button>
                                                 <button type="button" class="btn btn-dark" onClick={() => {
                                                     window.open(`https://ipfs.infura.io/ipfs/${certificate.certHash}`)
                                                 }}>  View</button>
                                               </div>
                                            </div>
                                            <br/>
                                        </div>
                                    </div>
                                  )
                                 }
                                }
                            })}
                           </ul>
                         </div>
                        <br/>
                      </center>
                    </div>
                  </main>
              </div>
              <hr/>


          <div className="row" id="uploaded">
            <main role="main" className="col-lg-100">
                <div id="content"><center>
                        <div className="certificate">
                        <h1><center>Uploaded Certificates</center></h1>
                        <ul id="certList" className="list-unstyled">
                         {this.props.certificates.map((certificate, key) => {
                           const { account, contractR, certificates,name, ...props} = this.props;
                           if(this.props.account === certificate.uploader) {
                           return (
                             <div className = "certificates" key = {key}>
                             {key+1}.Student (UID: {certificate.uid})'s Certificate with the Hash {certificate.certHash} uploaded successfully!
                                 <br/>
                             </div>
                           )
                          }
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
