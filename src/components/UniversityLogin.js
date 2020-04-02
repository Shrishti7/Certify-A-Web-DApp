import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import Navbar from "./Navbar.js"
import './Login.css';


class UniversityLogin extends Component {

constructor(props){
  super(props);
  const {account, contractR} = this.props;
}

  render() {
    return (
      <div>
      <div className="sidebar">
      <ul>
          <li><a href="#content-profile" className="nav-link px-2">
              <i className="material-icons icon">
                person
              </i>
              <span className="text">User Profile</span>
            </a></li>
          <li><a href="#content-sent" className="nav-link px-2">
              <i className="material-icons icon">
                send
              </i>
              <span className="text">Send Certificate</span>
            </a></li>
          <li><a href="#" className="nav-link px-2">
              <i className="material-icons icon">
                exit_to_app
              </i>
              <span className="text">Log Out</span>
            </a></li>
      </ul>
  </div>

  <div className="container-fluid">
      <div className="row">
          <main role="main" className="col-lg-10">
              <div id="content-profile">
                  <h1><center>Profile</center></h1>
                  <div>
                      <form name="a">
                        <div>
                            Name:&nbsp<input type="text" name="name" className="form-a"/>
                        </div>
                        <br/>
                        <div>
                            Email:&nbsp<input type="text" name="email" className="form-a"/>
                        </div>
                        <br/>
                        <div>
                            UID  :&nbsp<input type="text" name="uid" className="form-a"/>
                        </div>
                        <br/>
                        <div>
                            Certificate:&nbsp<input type="file" name="cc"className="form-a"/>
                        </div>
                      </form>
                  </div>
              </div>
          </main>
      </div>
</div>

      <div class="row">
          <main role="main" class="col-lg-10">
              <div id="content-send">
                  <h1><center>Send Certificate</center></h1>
                  <div>
                      <br/>
                      <form name="b">
                          <div>
                              Company ID:&nbsp<input type="text" name="cid"/>
                          </div>
                          <br/>
                          <div>
                              <center><button id="snd" type="submit">Send Certificate</button></center>
                          </div>
                      </form>
                  </div>
              </div>

          </main>
      </div>
    </div>
    );
  }
}

export default UniversityLogin;
