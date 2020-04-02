import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import Navbar from "./Navbar.js"
import './Login.css';

class CompanyLogin extends Component {


  render() {
    return (
      <div>
          <div id="sidebar" className="">
          <div className="toggle-btn mx-auto" >
                <h3 className= "bg-dark text-center ml-auto mr-auto">Company Profile</h3>
          </div>
          <ul>
          <p className="mt-5"> </p>
          <a href = ""><li> Company Profile</li></a>
          <a href = ""><li>View Certificate</li></a>
          </ul>
        </div>

        <div className="container-fluid ml-15">
          <form>
            <label></label> <label></label>
          </form>
        </div>
    </div>
    );
  }
}

export default CompanyLogin;
