import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, Alerts, Card } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert';

const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class UniversityLogin extends Component {

constructor(props){
  super(props);
 const {account, contractR, name, uid, email, profile, dateTime} = this.props;
 this.state = {
   nuid: '',
   buffer: null,
   certHash: '',
   certs: [],
   searchId: '',
   uploader: '',
   dateTime: ''
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
        swal("Yay!", `Certificate added to the IPFS with certHash: ${this.state.certHash}`, "success");
        if(error) {
          console.error(error)
          return
        }
        //Step 2: Store the file on blockchain
          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var dateTime = date+' '+time;
          this.setState({dateTime})
          console.log('Date and Time', this.state.dateTime);
          this.props.contractR.methods.Upload (
          this.state.nuid,
          this.state.certType,
          certHash,
          this.state.dateTime
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

//Step1





render() {
return (
  <div className = "back" >
        <div className="sidebar">
          <ul>
              <li><a className="nav-link px-3" href = "#prof">
                  <i className="material-icons icon">
                    person
                  </i>
                  <span className="text">University Profile</span>
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
                          <form name="a">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Student UID</span>
                              </div>
                                <input type="text" className="form-control"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                name="nuid"
                                required=""
                                onChange={this.handleChange.bind(this)}
                                />
                            </div>


                             <div class="input-group mb-3">
                               <select class="custom-select"
                               id="inputGroupSelect01"
                               name="certType"
                               ref={this.selectRef}
                               onChange={this.handleChange.bind(this)}
                               required=""
                               >
                                 <option selected disabled hidden> Certificate Type ...</option>
                                 <option  value="Academic" name="profile">Academic</option>
                                 <option  value="ExtraCurricular" name="profile">Extra-Curricular</option>
                               </select>
                             </div>


                            <div className="input-group mb-3">
                              <div className="custom-file">
                                <input type="file"
                                  className="custom-file-input"
                                  name="cid"
                                  id="inputGroupFile01"
                                  onChange = {this.captureFile.bind(this)}
                                  required
                                  />
                                <label className="custom-file-label" for="inputGroupFile01"><small>Select Certificate</small></label>
                              </div>
                            </div>


                            <br/>
                            <div>
                          {/* <center><button id="snd" type="submit" onClick = {this.onSubmit.bind(this)}>Upload Certificate</button></center> <br/> */}
                                <center><button id="snd" type="button" class="btn btn-outline-info" onClick = {this.onSubmit.bind(this)}>Upload</button></center><br/>
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
                           </form>
                           <ul id="certList" className="list-unstyled">
                            {this.props.certificates.map((certificate, key) => {
                              if(this.props.account === certificate.uploader) {
                                if(this.state.searchId === certificate.uid) {
                                  if(certificate.certType === "Academic") {
                                    return (
                                      <div>
                                        <h3><center>Academic Certificates</center></h3>
                                          <div className = "cert-template" key = {key}>
                                              <div className="theCard">
                                                <div className = "theFront">
                                                    <img className="image" src = {`https://ipfs.infura.io/ipfs/${certificate.certHash}`}/>
                                                </div>
                                                <div className="theBack">
                                                   <div class="card text-white bg-danger mb-3">
                                                     <div class="card-header"> <h5 class="card-title">Certificate Details</h5></div>
                                                     <div class="card-body">
                                                       <p> Certificate Count: {key+1}<br/>
                                                         Student UID: {certificate.uid}<br/></p>
                                                       <button type="button" class="btn btn-success" onClick={() => {
                                                           if(this.props.profile==="University"){
                                                             swal("Certificate Verified!", `Uploaded by: ${this.props.name} on ${certificate.time}`, "success");
                                                           }
                                                       }}>Verify </button>   &nbsp;
                                                       <button type="button" class="btn btn-info" onClick={() => {
                                                           window.open(`https://ipfs.infura.io/ipfs/${certificate.certHash}`)
                                                       }}>View</button>
                                                     </div>
                                                   </div>
                                                 </div>
                                              </div>
                                          </div>
                                        </div>
                                    )
                                  }
                                 }
                                }
                            })}
                           </ul>

                           <ul id="certList" className="list-unstyled">
                            {this.props.certificates.map((certificate, key) => {
                              if(this.props.account === certificate.uploader) {
                                if(this.state.searchId === certificate.uid) {
                                  if(certificate.certType === "ExtraCurricular") {
                                    return (
                                      <div>
                                        <h3><center>Extra-Curricular Certificates</center></h3>
                                          <div className = "cert-template" key = {key}>
                                              <div className="theCard">
                                                <div className = "theFront">
                                                    <img className="image" src = {`https://ipfs.infura.io/ipfs/${certificate.certHash}`}/>
                                                </div>
                                                <div className="theBack">
                                                   <div class="card text-white bg-danger mb-3">
                                                     <div class="card-header"> <h5 class="card-title">Certificate Details</h5></div>
                                                     <div class="card-body">
                                                       <p> Certificate Count: {key+1}<br/>
                                                         Student UID: {certificate.uid}<br/></p>
                                                       <button type="button" class="btn btn-success" onClick={() => {
                                                           if(this.props.profile==="University"){
                                                             swal("Certificate Verified!", `Uploaded by: ${this.props.name} on ${certificate.time}`, "success");
                                                           }
                                                       }}>Verify </button>   &nbsp;
                                                       <button type="button" class="btn btn-info" onClick={() => {
                                                           window.open(`https://ipfs.infura.io/ipfs/${certificate.certHash}`)
                                                       }}>View</button>
                                                     </div>
                                                   </div>
                                                 </div>
                                              </div>
                                          </div>
                                        </div>
                                    )
                                  }
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
                           const { account, contractR, certificates,name, registrations, ...props} = this.props;
                           if(this.props.account === certificate.uploader) {
                             var reg = registrations.find((registration) => registration.uid === certificate.uid)
                               return (
                                   <div>
                                     <div className = "certificates" key = {key}>
                                     {key+1}.Student {reg.name}'s (UID: {certificate.uid}) {certificate.certType} Certificate was uploaded on {certificate.time} successfully!
                                         <br/>
                                     </div>
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
