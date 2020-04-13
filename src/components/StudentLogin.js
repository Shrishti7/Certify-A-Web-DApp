import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';

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
     companyCert: []
   };
   console.log('Contract R currently', {contractR})
 }

 handleChange = (e) => {
   let {name, value} = e.target;
   this.setState({ [e.target.name]: e.target.value });
 };

 logout = async () => {
   window.location.reload()
 }

 sendCert = async (event) => {
   event.preventDefault()
   console.log("Sending Certificates...")
   const { account, contractR, certificates, companyCerts, uid, ...props} = this.props;
   this.setState({contractR})
   this.setState({account})
   this.setState({certificates})
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
                    <li><a className="nav-link px-3">
                        <i className="material-icons icon">
                          person
                        </i>
                        <span className="text">User Profile</span>
                      </a></li>
                    <li><a className="nav-link px-3">
                        <i className="material-icons icon">
                          send
                        </i>
                        <span className="text">Send Certificate</span>
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
                <div className="row">
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


                  <div className="row">
                    <main role="main" className="col-lg-100">
                        <div id="content"><center>
                            <h1><center>Send Certificate</center></h1>
                            <div>
                                <br/>
                                <form name="b">
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


                <div className="row">
                  <main role="main" className="col-lg-100">
                      <div id="content"><center>
                        <h1><center>My Certificates</center></h1>
                          <div>
                            <br/>
                              <ul id="certList" className="list-unstyled">
                               {this.props.certificates.map((certificate, key) => {
                                 if(this.props.uid === certificate.uid) {
                                   return (
                                     <div className = "certTemplate" key = {key}>
                                       <label>
                                         <span className = "content"> Cert Count: {key+1}<br/> </span>
                                         <span className = "content"> UID: {certificate.uid}<br/> </span>
                                         <span className = "content"> Certificate Hash: {certificate.certHash}<br/> </span>
                                         <span className = "content"> Certificate: <img src = {`https://ipfs.infura.io/ipfs/${certificate.certHash}`}/><br/> </span>
                                         <br/>
                                       </label>
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

export default StudentLogin;
