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
     searchId: ''
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
                            <span className="text">Profile</span>
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
                            <span className="text">View Certificate</span>
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
                                     Student UID  <input type="text" name= "searchId" className="form-b" onChange={this.handleChange.bind(this)}  required/>
                                    </div>
                                    <ul id="certList" className="list-unstyled">
                                     {this.props.companyCerts.map((companyCert, key) => {
                                       if(companyCert.cuid === this.props.uid) {
                                         if(this.state.searchId === companyCert.suid) {
                                         return (
                                           <div className = "certTemplate" key = {key}>
                                             <label>
                                               <span className = "content"> Cert Count: {key+1}<br/> </span>
                                               <span className = "content"> Student UID: {companyCert.suid}<br/> </span>
                                               <span className = "content"> Certificate Hash: {companyCert.compCertHash}<br/> </span>
                                               <span className = "content"> Certificate: <img className="image" src = {`https://ipfs.infura.io/ipfs/${companyCert.compCertHash}`}/><br/> </span>
                                               <br/>
                                             </label>
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


                      <div className="row" id="view_cert">
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
                                               <span className = "content"> Certificate: <img className="image" src = {`https://ipfs.infura.io/ipfs/${companyCert.compCertHash}`}/><br/> </span>
                                               <br/>
                                             </label>
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
