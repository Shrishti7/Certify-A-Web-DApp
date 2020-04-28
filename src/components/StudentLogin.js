import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';
import swal from 'sweetalert';

const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })



class StudentLogin extends Component {

  constructor(props){
    super(props);
   const {account, contractR, name, uid, email, certificates, companyCerts, dateTime} = this.props;
   this.state = {
     nuid: '',
     buffer: null,
     certHash: '',
     companyCert: [],
     uploader_name: '',
     uploader_profile: ''
   };
   console.log('Contract R currently', {contractR})
 }

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

 handleChange = (e) => {
   let {name, value} = e.target;
   this.setState({ [e.target.name]: e.target.value });
 };

 logout = async() => {
   window.location.reload()
 }

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

     if((user_uid===this.props.uid))
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
         console.log("New UID: ", this.state.uid)
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
           this.props.uid,
           this.state.certType,
           certHash,
           this.state.dateTime
         ).send({from: this.state.account}, (err, txHash) => {
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

 sendCert = async (event) => {
   event.preventDefault()
   console.log("Sending Certificates...")
   const { account, contractR, certificates, companyCerts, uid, registrations, dateTime, ...props} = this.props;
   this.setState({contractR})
   this.setState({account})
   this.setState({certificates})
   this.setState({registrations})
     const globalCertCount = await contractR.methods.globalCertCount().call()
     console.log('Global certificate count in StudentLogin:', globalCertCount.toNumber());
     const companyCertCount = await contractR.methods.companyCertCount().call()
     console.log('Company Certificate initially:', companyCertCount.toNumber());
    {/* const c = certificates.filter((certificate) => {
       if(this.state.sendCertType === "Academic"){
         const c1 = certificates.map((certificate) => certificate.certType === "Academic"){

         }
         return c1
       }
       else if (this.state.sendCertType === "ExtraCurricular") {
         const c2 = certificates.filter((certificate) => certificate.certType === "ExtraCurricular")
         return c2
       }
       else {
         return certificate
       }
     })
 */}

     if(this.state.sendCertType === "Academic"){
              this.props.certificates.map((certificate, key) => {
              if(certificate.certType === "Academic") {
              if(registrations.find((registration) => registration.uid===this.state.cid)){
                if(certificate.uid === this.props.uid) {
                  this.setState({uid})
                    var u = registrations.find((registration) => registration.wallet === certificate.uploader)
                  console.log('Certificate:', certificate);
                     contractR.methods.Send (
                      this.state.uid,
                      this.state.cid,
                      certificate.certType,
                      certificate.certHash,
                      u.name,
                      u.profile,
                      certificate.time
                      ).send({from: account}, (err, txHash) => {
                      console.log('TxHash', key, ':', txHash);
                      this.setState({companyCerts})
                      console.log('Company Cert Count', this.state.companyCerts);
                    })
                 }
              }
            }

          })
        }

        else if (this.state.sendCertType === "ExtraCurricular") {
          this.props.certificates.map((certificate, key) => {
          if(certificate.certType === "ExtraCurricular") {
          if(registrations.find((registration) => registration.uid===this.state.cid)){
            if(certificate.uid === this.props.uid) {
              this.setState({uid})
                var u = registrations.find((registration) => registration.wallet === certificate.uploader)
              console.log('Certificate:', certificate);
                 contractR.methods.Send (
                  this.state.uid,
                  this.state.cid,
                  certificate.certType,
                  certificate.certHash,
                  u.name,
                  u.profile,
                  certificate.time
                  ).send({from: account}, (err, txHash) => {
                  console.log('TxHash', key, ':', txHash);
                  this.setState({companyCerts})
                  console.log('Company Cert Count', this.state.companyCerts);
                })
             }
          }
        }

      })
        }
        else if(this.state.sendCertType === "All") {
          this.props.certificates.map((certificate, key) => {
          if(registrations.find((registration) => registration.uid===this.state.cid)){
            if(certificate.uid === this.props.uid) {
              this.setState({uid})
              var u = registrations.find((registration) => registration.wallet === certificate.uploader)
              console.log("Uploader Name: ", u.name);
              console.log("Uploader profile: ", u.profile);
              console.log('Certificate:', certificate);
                  contractR.methods.Send (
                  this.state.uid,
                  this.state.cid,
                  certificate.certType,
                  certificate.certHash,
                  u.name,
                  u.profile,
                  certificate.time
                  ).send({from: account}, (err, txHash) => {
                  console.log('TxHash', key, ':', txHash);
                  this.setState({companyCerts})
                  console.log('Company Cert Count', this.state.companyCerts);
                })
             }
          }

      })
        }
 }


    render() {
      return (
        <div className="back">
              <div className="sidebar">
                <ul>
                    <li><a className="nav-link px-3" href="#prof">
                        <i className="material-icons icon">
                          person
                        </i>
                        <span className="text">Profile</span>
                      </a></li>
                      <li><a className="nav-link px-3" href="#certs">
                          <i className="material-icons icon">
                            assignment
                          </i>
                          <span className="text">My Certificate</span>
                        </a></li>
                    <li><a className="nav-link px-3" href="#send_certs">
                        <i className="material-icons icon">
                          send
                        </i>
                        <span className="text">Send Certificate</span>
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
                <div className="row" id="prof">
                    <main role="main" className="col-lg-50 d-flex text-center">

                        <div className="content mr-auto ml-auto"><center>
                            <h1><center>Student Profile</center></h1>
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

                  <div className="row" id="upload_certs">
                    <main role="main" className="col-lg-100">
                        <div id="content"><center>
                            <h1><center>Upload Certificate</center></h1>
                            <div>
                                <br/>
                                  <form>
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
                                         <center><button id="snd" type="button" class="btn btn-outline-info" onClick = {this.onSubmit.bind(this)}>Upload</button></center><br/>
                                     </div>
                                </form>
                            </div>
                          </center>
                        </div>
                      </main>
                   </div>
                   <hr/>

                <div className="row" id="certs">
                  <main role="main" className="col-lg-100">
                      <div id="content"><center>
                        <h1><center>My Certificates</center></h1>
                          <div>
                            <br/>
                              <h3><center>Academic Certificates</center></h3>
                              <ul id="certList" className="list-unstyled">
                               {this.props.certificates.map((certificate, key) => {
                                 if(this.props.uid === certificate.uid) {
                                   const { account, contractR, certificates, registrations, dateTime, ...props} = this.props;
                                   var reg = registrations.find((registration) => registration.wallet === certificate.uploader)
                                   if(certificate.certType === "Academic"){
                                     return (
                                           <div className = "cert-template" key = {key}>
                                           <div className="theCard">
                                             <div className = "theFront">
                                                 <img className="image" src = {`https://ipfs.infura.io/ipfs/${certificate.certHash}`}/><br/>
                                             </div>
                                             <div className="theBack">
                                                <div class="card text-white bg-danger mb-3">
                                                  <div class="card-header"> <h5 class="card-title">Certificate Details</h5></div>
                                                  <div class="card-body">
                                                    <p> Certificate Count: {key+1}<br/>
                                                      Student UID: {certificate.uid}<br/>
                                                      Certificate Hash: {certificate.certHash}</p>
                                                    <button type="button" class="btn btn-success" onClick={() => {
                                                      if(reg.profile==="University"){
                                                        swal("Certificate Verified!", ` Uploaded by: ${reg.name} on ${certificate.time}`, "success");
                                                        }
                                                        else if (reg.profile==="Student") {
                                                          swal("Certificate Not Verified!", ` Uploaded by: ${reg.name} on ${certificate.time}`, "error");
                                                        }
                                                    }}>Verify </button>   &nbsp;
                                                    <button type="button" class="btn btn-info" onClick={() => {
                                                        window.open(`https://ipfs.infura.io/ipfs/${certificate.certHash}`)
                                                    }}>View</button>
                                                  </div>
                                                  <br/>
                                                </div><br/>
                                              </div><br/>
                                           </div><br/>
                                           <br/>
                                        </div>
                                     )
                                   }
                                 }
                               })}
                              </ul>
                              <br/>
                              <br/>
                              <h3><center>Extra-Curricular Certificates</center></h3>
                              <ul id="certList" className="list-unstyled">
                               {this.props.certificates.map((certificate, key) => {
                                 if(this.props.uid === certificate.uid) {
                                   const { account, contractR, certificates, registrations, dateTime, ...props} = this.props;
                                   var reg = registrations.find((registration) => registration.wallet === certificate.uploader)
                                   if(certificate.certType === "ExtraCurricular"){
                                     return (
                                           <div className = "cert-template" key = {key}><br/>
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
                                                      if(reg.profile==="University"){
                                                        swal("Certificate Verified!", ` Uploaded by: ${reg.name} on ${certificate.time}`, "success");
                                                        }
                                                        else {
                                                          swal("Certificate Not Verified!", ` Uploaded by: ${reg.name} on ${certificate.time}`, "error");
                                                        }
                                                    }}>Verify </button>   &nbsp;
                                                    <button type="button" class="btn btn-info" onClick={() => {
                                                        window.open(`https://ipfs.infura.io/ipfs/${certificate.certHash}`)
                                                    }}>View</button>
                                                  </div>
                                                </div><br/>
                                              </div><br/>
                                            </div><br/>
                                           <br/>
                                          </div>
                                     )
                                   }
                                 }
                               })}
                              </ul>
                              <br/>
                           </div>
                          <br/>
                        </center>
                    </div>
                 </main>
           </div>
           <br/>
           <hr/>
           <div className="row" id="send_certs">
             <main role="main" className="col-lg-100">
                 <div id="content"><center>
                     <h1><center>Send Certificate</center></h1>
                     <div>
                         <br/>
                             <div>
                                 Company UID<input type="text" name="cid" className="form-b" onChange={this.handleChange.bind(this)} required/>

                                 <div class="input-group mb-3">
                                   <select class="custom-select"
                                   id="inputGroupSelect01"
                                   name="sendCertType"
                                   ref={this.selectRef}
                                   onChange={this.handleChange.bind(this)}
                                   required=""
                                   >
                                     <option selected disabled hidden> Certificate Type ...</option>
                                     <option  value="Academic" name="profile">Academic</option>
                                     <option  value="ExtraCurricular" name="profile">Extra-Curricular</option>
                                     <option  value="All" name="profile">All</option>
                                   </select>
                                 </div>

                             </div>
                             <br/>
                             <div>
                                 <center><button id="snd" type="submit" onClick={this.sendCert.bind(this)}>Send Certificate</button></center>
                             </div>
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

export default StudentLogin;
