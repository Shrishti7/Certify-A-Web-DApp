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
   const {account, contractR, name, uid, email, certificates, companyCerts} = this.props;
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

 handleChange = (e) => {
   let {name, value} = e.target;
   this.setState({ [e.target.name]: e.target.value });
 };

 logout = async() => {
   window.location.reload()
 }

 sendCert = async (event) => {
   event.preventDefault()
   console.log("Sending Certificates...")
   const { account, contractR, certificates, companyCerts, uid, registrations, ...props} = this.props;
   this.setState({contractR})
   this.setState({account})
   this.setState({certificates})
   this.setState({registrations})
     const globalCertCount = await contractR.methods.globalCertCount().call()
     console.log('Global certificate count in StudentLogin:', globalCertCount.toNumber());
     const companyCertCount = await contractR.methods.companyCertCount().call()
     console.log('Company Certificate initially:', companyCertCount.toNumber());
     this.props.certificates.map((certificate, key) => {
       // const certificate = await contractR.methods.certificates(j).call()
       // const user_certid = certificate[0].toNumber()
       // const user_uid = certificate[1]
       // const user_certHash = certificate[2]
       if(certificate.uid === this.props.uid) {
         this.setState({uid})
         console.log('Certificate:', certificate);
             contractR.methods.Send (
             this.state.uid,
             this.state.cid,
             certificate.certHash
             ).send({from: account}, (err, txHash) => {
             console.log('TxHash', key, ':', txHash);
             this.setState({companyCerts})
             console.log('Company Cert Count', this.state.companyCerts);
           })
       }
     })
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


                <div className="row" id="certs">
                  <main role="main" className="col-lg-100">
                      <div id="content"><center>
                        <h1><center>My Certificates</center></h1>
                          <div>
                            <br/>
                              <ul id="certList" className="list-unstyled">
                               {this.props.certificates.map((certificate, key) => {
                                 if(this.props.uid === certificate.uid) {
                                   const { account, contractR, certificates, registrations, ...props} = this.props;
                                  {/* {this.props.registrations.map((registration, key) => {
                                     if(registration.wallet === certificate.uploader) {
                                       this.setState({uploader_name: registration.name})
                                       this.setState({uploader_profile: registration.profile})
                                       return;
                                     }
                                   })} */}
                                   var reg = registrations.find((registration) => registration.wallet === certificate.uploader)
                                   return (
                                     <div className = "cert-template" key = {key}>
                                     <div className="theCard">
                                       <div className = "theFront">
                                           <img className="image" src = {`https://ipfs.infura.io/ipfs/${certificate.certHash}`}/>
                                       </div>
                                       <div className="theBack">
                                          <p> Certificate Count: {key+1}<br/>
                                            Student UID: {certificate.uid}<br/>
                                            Certificate Hash: {certificate.certHash}<br/>
                                            Uploaded By: {reg.name}</p>
                                          <button type="button" class="btn btn-success" onClick={() => {
                                              if(reg.profile==="University"){
                                                swal("Certificate Verified!", `${reg.name}`, "success");
                                              }
                                          }}>Verify </button>
                                          <button type="button" class="btn btn-dark" onClick={() => {
                                              window.open(`https://ipfs.infura.io/ipfs/${certificate.certHash}`)
                                          }}>  View</button>
                                        </div>
                                     </div>
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
           <br/>
           <hr/>
           <div className="row" id="send_certs">
             <main role="main" className="col-lg-100">
                 <div id="content"><center>
                     <h1><center>Send Certificate</center></h1>
                     <div>
                         <br/>
                         <form name="a">
                             <div>
                                 Company UID<input type="text" name="cid" className="form-b" onChange={this.handleChange.bind(this)}  required/>
                             </div>
                             <br/>
                             <div>
                                 <center><button id="snd" type="submit" onClick={this.sendCert.bind(this)}>Send Certificate</button></center>
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

export default StudentLogin;
