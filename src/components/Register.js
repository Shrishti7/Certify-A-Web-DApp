import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Navbar from "./Navbar.js"
import './Register.css';
import StudentLogin from "./StudentLogin"
import UniversityLogin from "./UniversityLogin"
import CompanyLogin from "./CompanyLogin"
// import SweetAlert from 'sweetalert-react';
// import 'sweetalert/dist/sweetalert.css';
import swal from 'sweetalert';

// const Register = () => {
  class Register extends Component {
    constructor(props) {
      super(props);
       this.selectRef = React.createRef();
       this.state = {
         showLogin: false,
         profile1: 0,
         profile: "",
         uid: "",
         name: "",
         email: "",
       }
    }



    handleChange = (e) => {
      let {name, value} = e.target;
      this.setState({ [e.target.name]: e.target.value });
    };

    registerAccount = async (e) => {
      e.preventDefault();
      this.setState({ loading: true})

      const { account, contractR, showLogin, registrations} = this.props;
      console.log(contractR);
      console.log('Showlogin in register.js', this.props.showLogin);
      var j = 0
      var e = 0
      const registrationCount = await contractR.methods.registrationCount().call()
      for (var i = 1; i<= registrationCount; i++) {
        const registration = await contractR.methods.students(i).call()
        const user_id = registration[0].toNumber()
        const user_profile = registration[1]
        const user_uid = registration[2]
        const user_name = registration[3]
        const user_email = registration[4]
        const user_wallet = registration[5]

        if((user_uid===this.state.uid)||(user_email===this.state.email)||(user_wallet===this.props.account))
        {
          j = j+1;
          if(user_uid===this.state.uid){
            e = 1;
          }
          else if(user_email===this.state.email) {
            e = 2;
          }
          else if (user_wallet===this.props.account) {
            e = 3;
          }
        }
      }

      if(j<1) {
          this.setState({ loading: false})
          await contractR.methods.Register (
           this.state.profile,
           this.state.uid,
           this.state.name,
           this.state.email
           ).send({from: account}, (err, txHash) => {
           window.location.reload()
           console.log(txHash);
         })
      }
      else {
        if(e === 1){
            swal("Oops!", "UID already registered!", "error");
        }
        else if(e === 2) {
            swal("Oops!", "Email already registered!", "error");
        }
        else if (e === 3) {
            swal("Oops!", "Account already registered!", "error");
        }

          // window.alert("UID/email/account already registered with another account!")
        }
    }

  loginAccount = async (e) => {
    e.preventDefault();
    var p = 0
    var k = 0
    const { account, contractR, uid, certificates, showLogin, companyCerts, registrations, dateTime} = this.props;
    const registrationCount = await contractR.methods.registrationCount().call()
    for (var i = 1; i<= registrationCount; i++) {
      const registration = await contractR.methods.students(i).call()
      const user_profile = registration[1]
      console.log(registration[1])
      const user_wallet = registration[5]

      if((user_wallet===this.props.account))
      {
        p = p+1
        k = i
        console.log(k)
        const por = registration[1]
        console.log('Current Profile', this.setState({profile1: por}))
        break;
      }
    }
    console.log('k: ',k)
    if (p===1) {
      const registration = await contractR.methods.students(k).call()
      console.log({account})
      const por = registration[1].toString()
      console.log('por: ',por)
      this.setState({profile: registration[1]})
      this.setState({uid: registration[2]})
      this.setState({name: registration[3]})
      this.setState({email: registration[4]})
      this.setState({contractR})
      this.setState({account})
      this.setState({certificates})
      this.setState({registrations})
      this.setState({companyCerts})
      this.setState({dateTime})
      console.log('Company certs in Login', this.state.companyCerts);
      console.log('Profile state', this.state.profile)
      // console.log('Contract R currently', {contractR})
      // console.log('Contract C currently', {contractC})
      console.log("showLogin in login func", this.props.showLogin)
      if(por === 'Student') {
        this.setState({profile1: 1})
        this.setState({showLogin: true})
      }
      else if(por === 'Company') {
        this.setState({profile1: 2})
        this.setState({showLogin: true})
      }
      else if(por === 'University'){
        this.setState({profile1: 3})
        this.setState({showLogin: true})
      }
    }
    else {
        swal("Uh-oh!", "Account isn't registered!", "info");
    }
  }


    render () {

  if(this.state.showLogin === false) {
    return (
          <div className="bod" >
          <div className="container-fluid mt-5">
            <div className="row" >
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                     <form>
                      <h1 className="tc">Certify</h1>
                      <div>
                        <br/>
                        <h3>Register</h3>
                         <select id="profile"
                         className="profile text-center"
                         name="profile"
                         ref={this.selectRef}
                         onChange={this.handleChange.bind(this)}
                         required=""
                         >
                              <option  value= "null" selected disabled hidden> Profile </option>
                              <option  value="Student" name="profile">Student</option>
                              <option  value="University" name="profile">University</option>
                              <option  value="Company" name="profile">Company</option>
                          </select>
                          <p> </p>

                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">@</span>
                            </div>
                              <input type="text" class="form-control"
                               placeholder="User ID"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              name="uid"
                              id = "uid"
                              required=""
                              onChange={this.handleChange.bind(this)}
                              />
                          </div>

                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">@</span>
                            </div>
                              <input type="text" class="form-control"
                               placeholder="Name"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              name="name"
                              id = "name"
                              required=""
                              onChange={this.handleChange.bind(this)}
                              />
                          </div>

                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">@</span>
                            </div>
                              <input type="text" class="form-control"
                               placeholder="Email"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              name="email"
                              id = "email"
                              required=""
                              onChange={this.handleChange.bind(this)}
                              />
                          </div>

                          {/* <Form.Label>Unique Identification Number</Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="UID"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="text" name="uid"
                              id = "uid"
                              required=""
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>*/}

                        {/*   <Form.Label>Name</Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Name"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="text" name="name"
                              id = "name"
                              required=""
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>*/}

                        {/*   <Form.Label>Email</Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Email"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="text" name="email" id="email"
                              required=""
                              onChange={this.handleChange.bind(this)}
                              />
                          </InputGroup>*/}

                          <center><Button variant="light" id="but" type="submit" className="mr-2" onClick={this.registerAccount.bind(this)}> Register </Button></center>
                          </div>
                          <hr/>
                        </form>

                        <h3>Login</h3>
                        <p className="text-center"> Already registered? </p>
                        <center><Button variant="light" id="but" type="submit" className="mr-2" onClick = {this.loginAccount.bind(this)} >Login</Button></center> <br/><br/><br/><br/><br/>
                        </div>
                      </main>
                    </div>
                  </div>
          </div>

      );
 }

   else {
           if(this.state.profile1 === 1){
             const props = { account: this.state.account, companyCerts:this.state.companyCerts, contractR: this.state.contractR , dateTime: this.state.dateTime, registrations: this.state.registrations, profile: this.state.profile, uid: this.state.uid, showLogin: this.state.showLogin, certificates: this.state.certificates}
             return (
               <div>
               <StudentLogin account = {this.state.account} companyCerts = {this.state.companyCerts} contractR = {this.state.contractR} dateTime = {this.state.dateTime} profile = {this.state.profile} name = {this.state.name} email = {this.state.email} uid = {this.state.uid} showLogin = {this.state.showLogin} {...props}/>
               </div>
             );
           }
           else if (this.state.profile1 === 2) {
             const props = { account: this.state.account, contractR: this.state.contractR , companyCerts:this.state.companyCerts,profile: this.state.profile, dateTime: this.state.dateTime, registrations: this.state.registrations, uid: this.state.uid, showLogin: this.state.showLogin, certificates: this.state.certificates}
             return (
               <div> <CompanyLogin account = {this.state.account} companyCerts = {this.state.companyCerts} contractR = {this.state.contractR} dateTime = {this.state.dateTime} profile = {this.state.profile} name = {this.state.name} email = {this.state.email} uid = {this.state.uid} showLogin = {this.state.showLogin} {...props}/>
               </div>
             );
           }
           else if (this.state.profile1 === 3) {
             const props = { account: this.state.account, companyCerts:this.state.companyCerts, contractR: this.state.contractR , profile: this.state.profile, dateTime: this.state.dateTime, registrations: this.state.registrations, uid: this.state.uid, showLogin: this.state.showLogin, certificates: this.state.certificates}
             return (
               <div>
               <UniversityLogin account = {this.state.account} companyCerts = {this.state.companyCerts} contractR = {this.state.contractR} dateTime = {this.state.dateTime} profile = {this.state.profile} name = {this.state.name} email = {this.state.email} uid = {this.state.uid} showLogin = {this.state.showLogin} {...props} />
               </div>
             );
           }
        }
    }
}

export default Register;
