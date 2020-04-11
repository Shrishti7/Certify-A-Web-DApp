import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Login.css';

const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class CompanyLogin extends Component {

  constructor(props){
    super(props);
   const {account, contractR, name, uid, email, certificates, companyCerts} = this.props;
   this.state = {
     nuid: '',
     buffer: null,
     certHash: '',
   };
   console.log('Contract R currently', {contractR})
   console.log('companyCerts in Company: ', this.props.companyCerts);
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
                              pageview
                            </i>
                            <span className="text">View Certificate</span>
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
                                <h1><center>View Certificate</center></h1>
                                <div>
                                    <br/>
                                    <ul id="certList" className="list-unstyled">
                                     {this.props.companyCerts.map((companyCert, key) => {
                                       if(companyCert.cuid === this.props.uid) {
                                         return (
                                           <div className = "certTemplate" key = {key}>
                                             <label>
                                               <span className = "content"> Cert Count: {key+1}<br/> </span>
                                               <span className = "content"> Student UID: {companyCert.suid}<br/> </span>
                                               <span className = "content"> Certificate Hash: {companyCert.compCertHash}<br/> </span>
                                               <span className = "content"> Certificate: <img src = {`https://ipfs.infura.io/ipfs/${companyCert.compCertHash}`}/><br/> </span>
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

export default CompanyLogin;
