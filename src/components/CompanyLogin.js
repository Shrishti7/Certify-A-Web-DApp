import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';
import swal from 'sweetalert';

const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class CompanyLogin extends Component {

  constructor(props){
    super(props);
   const {account, contractR, name, uid, email, certificates, companyCerts, registrations, dateTime} = this.props;
   this.state = {
     nuid: '',
     buffer: null,
     certHash: '',
     searchId: '',
     uploader_name: '',
     uploader_profile: ''
   };
   console.log('Contract R currently', {contractR})
   console.log('companyCerts in Company: ', this.props.companyCerts);
 }

 handleChange = (e) => {
   let {name, value} = e.target;
   this.setState({ [e.target.name]: e.target.value });
 };

 logout = async() => {
   window.location.reload()
 }

 onSearch = async(event) => {
   event.preventDefault()
   this.setState({searchId: this.state.searchId})
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
                            <span className="text">Company Profile</span>
                          </a></li>
                          <li><a className="nav-link px-3" href="#search_cert">
                              <i className="material-icons icon">
                                pageview
                              </i>
                              <span className="text">Search Certificate</span>
                            </a></li>
                        <li><a className="nav-link px-3" href="#view_cert">
                            <i className="material-icons icon">
                              visibility
                            </i>
                            <span className="text">Recieved Certificate</span>
                          </a></li>
                        <li><a className="nav-link px-3">
                            <i className="material-icons icon">
                              exit_to_app
                            </i>
                            <span className="text" onClick = {this.logout.bind(this)}>Log Out</span>
                          </a></li>
                    </ul>
                </div>


                <div className="container-fluid mt-5">
                    <div className="row" id="prof">
                        <main role="main" className="col-lg-50 d-flex text-center">

                            <div className="content mr-auto ml-auto"><center>
                                <h1><center>Company Profile</center></h1>
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

                      <div className="row" id="search_cert">
                        <main role="main" className="col-lg-100">
                            <div id="content"><center>
                                <h1><center>Search Certificate</center></h1>
                                <div>
                                    <br/>
                                    <div>
                                     Student UID  <input type="text" name= "searchId" className="form-b" onChange={this.handleChange.bind(this)}  required/> <br/>
                                    </div>

                                    <h3><center>Academic Certificates</center></h3>
                                    <ul id="certList" className="list-unstyled">
                                     {this.props.companyCerts.map((companyCert, key) => {
                                       if(companyCert.cuid === this.props.uid) {
                                         if(this.state.searchId === companyCert.suid) {
                                           const { account, contractR, certificates, registrations, ...props} = this.props;
                                           if(companyCert.certType === "Academic") {
                                             {/*const upl =  contractR.methods.getUploader(companyCert.certHash).call()
                                             var j=0;
                                             this.props.certificates.map((certificate,j) => {
                                               if(companyCert.suid === certificate.uid) {
                                                 console.log("Certificate hash in map", certificate.certHash);
                                                 console.log("Certificate uploader in map", certificate.uploader);
                                                 console.log("Certificate type in map", certificate.certType);
                                                 console.log("reg in cert map", reg.name);*/}

                                                 return (
                                                   <div className = "cert-template" key ={key}>
                                                  {/* // {  upl = certificates.find((certificate) => certificate.uid === companyCert.suid).then(
                                                   //   console.log("upl in Academic Cert", upl),
                                                   //   reg = registrations.find((registration) => registration.wallet === upl.uploader).then(
                                                   //     console.log("reg in cert map", reg.name)
                                                   //   )
                                                   // )
                                                   //  } */}
                                                     <div className="theCard">
                                                      <div className = "theFront">
                                                          <img className="image" src = {`https://ipfs.infura.io/ipfs/${companyCert.compCertHash}`}/>
                                                      </div>
                                                      <div className="theBack">
                                                          <div class="card text-white bg-danger mb-3">
                                                            <div class="card-header"> <h5 class="card-title">Certificate Details</h5></div>
                                                            <div class="card-body">
                                                              <p> Certificate Count: {key+1}<br/>
                                                                Student UID: {companyCert.suid}<br/>
                                                                  Certificate Hash: {companyCert.compCertHash}<br/></p>
                                                              <button type="button" class="btn btn-success" onClick={() => {
                                                                if(companyCert.uplProfile==="University"){
                                                                  swal("Certificate Verified!", ` Uploaded by: ${companyCert.uplProfile}- ${companyCert.uplName} on ${companyCert.time}`, "success");
                                                                  }
                                                                  else if (companyCert.uplProfile==="Student") {
                                                                    swal("Certificate Not Verified!", ` Uploaded by: ${companyCert.uplProfile}- ${companyCert.uplName} on ${companyCert.time}`, "error");
                                                                  }
                                                              }}>Verify </button>   &nbsp;
                                                              <button type="button" class="btn btn-info" onClick={() => {
                                                                  window.open(`https://ipfs.infura.io/ipfs/${companyCert.certHash}`)
                                                              }}>View</button>
                                                            </div>
                                                          </div>
                                                       </div>
                                                     </div>
                                                    <br/>
                                                   </div>
                                                 )
                                            {/*   }
                                             })  */}
                                           }
                                         }
                                      }
                                     })}
                                    </ul>
                                    <br/>

                                    <h3><center>Extra-Curricular Certificates</center></h3>
                                    <ul id="certList" className="list-unstyled">
                                     {this.props.companyCerts.map((companyCert, key) => {
                                       if(companyCert.cuid === this.props.uid) {
                                         if(this.state.searchId === companyCert.suid) {
                                           const { account, contractR, certificates, registrations, ...props} = this.props;
                                           if(companyCert.certType === "ExtraCurricular") {
                                             {/*var upl = certificates.find((certificate) => certificate.uid === companyCert.suid)
                                               const upl = contractR.methods.getUploader(companyCert.certHash).call()
                                              var reg = registrations.find((registration) => registration.wallet === upl.uploader)*/}
                                             return (
                                                     <div className = "cert-template" key = {key}><br/>
                                                       <div className="theCard">
                                                        <div className = "theFront">
                                                            <img className="image" src = {`https://ipfs.infura.io/ipfs/${companyCert.compCertHash}`}/>
                                                        </div>
                                                        <div className="theBack">
                                                            <div class="card text-white bg-danger mb-3">
                                                              <div class="card-header"> <h5 class="card-title">Certificate Details</h5></div>
                                                              <div class="card-body">
                                                                <p> Certificate Count: {key+1}<br/>
                                                                  Student UID: {companyCert.suid}<br/>
                                                                    Certificate Hash: {companyCert.compCertHash}<br/></p>
                                                                <button type="button" class="btn btn-success" onClick={() => {
                                                                  if(companyCert.uplProfile === "University"){
                                                                    swal("Certificate Verified!", ` Uploaded by:  ${companyCert.uplProfile}- ${companyCert.uplName} on ${companyCert.time}`, "success");
                                                                    }
                                                                  else if (companyCert.uplProfile=== "Student") {
                                                                    swal("Certificate Not Verified!", ` Uploaded by:  ${companyCert.uplProfile}- ${companyCert.uplName} on ${companyCert.time}`, "error");
                                                                  }
                                                                }}>Verify </button>   &nbsp;
                                                                <button type="button" class="btn btn-info" onClick={() => {
                                                                    window.open(`https://ipfs.infura.io/ipfs/${companyCert.certHash}`)
                                                                }}>View</button>
                                                              </div>
                                                            </div>
                                                         </div>
                                                       </div>
                                                      <br/>
                                                     </div>
                                                   )
                                                 }
                                                }
                                              }
                                             })}
                                           <br/>
                                          </ul>
                                       </div>
                                      <br/>
                                    </center>
                                  </div>
                              </main>
                            </div> <br/>
                            <hr/>


                      <div className="row" id="view_cert">
                        <main role="main" className="col-lg-100">
                            <div id="content"><center>
                                <h1><center>Recieved Certificate Notifications</center></h1>
                                <div>
                                    <br/>
                                    <ul id="certList" className="list-unstyled">
                                     {this.props.companyCerts.map((companyCert, key) => {
                                       if(companyCert.cuid === this.props.uid) {
                                         return (
                                           <div className = "certificates" key = {key}>
                                           {key+1}.Student (UID: {companyCert.suid}) sent their {companyCert.certType} Certificate on {companyCert.time}!
                                               <br/>
                                           </div>
                                         )
                                       }
                                     })}
                                    </ul>
                                 </div>
                                <br/>
                              </center>
                            </div>
                        </main>
                     </div>


                   </div>
                </div>
        );
    }
}

export default CompanyLogin;
