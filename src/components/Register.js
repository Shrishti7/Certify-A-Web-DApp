import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
// import Toast from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import Navbar from "./Navbar.js"
import StudentLogin from "./StudentLogin";

// const Register = () => {
  class Register extends Component {
    constructor(props) {
      super(props);
       this.selectRef = React.createRef();
    }


    handleChange = (e) => {
      let {name, value} = e.target;
      this.setState({ [e.target.name]: e.target.value });
    };

    registerAccount = async (e) => {
      e.preventDefault();
      this.setState({ loading: true})

      const { account, contractR, show} = this.props;
      console.log(contractR);
      var j = 0
      const registrationCount = await contractR.methods.registrationCount().call()
      for (var i = 1; i<= registrationCount; i++) {
        const registration = await contractR.methods.students(i).call()
        const user_id = registration[0].toNumber()
        const user_profile = registration[1]
        const user_uid = registration[2]
        const user_name = registration[3]
        const user_email = registration[4]
        const user_wallet = registration[5]

        if((user_uid==this.state.uid)||(user_email==this.state.email)||(user_wallet==this.props.account))
        {
          j = j+1;
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
           console.log(txHash);
           window.location.reload()
         })

      }
      else {
          window.alert("UID/email/account already registered with another account!")
        }
    }


  loginAccount = async (e) => {
    e.preventDefault();
    // this.setState({ loading: true})
    // var p = 0
    const { account, contractR, show} = this.props;
    // const registrationCount = await contractR.methods.registrationCount().call()
    // for (var i = 1; i<= registrationCount; i++) {
    //   const registration = await contractR.methods.students(i).call()
    //   const user_wallet = registration[5]

      // if((user_wallet==this.state.account))
      // {
      //   p = p+1
      // }
      // if (p==1) {
      //   this.setState({ loading: false})
      console.log({account})
        return (
            <Navbar account={this.props.account}/>
        );
      }


    render () {
      return (
          <div id="content" >
                     <form >

                        <br/>
                         <select id="profile"
                         className="profile"
                         name="profile"
                         ref={this.selectRef}
                         onChange={this.handleChange.bind(this)}
                         >
                              <option  value= "null" selected disabled hidden> Profile </option>
                              <option  value="Student" name="profile">Student</option>
                              <option  value="University" name="profile">University</option>
                              <option  value="Organization" name="profile">Company</option>
                          </select>
                          <p> </p>


                          <Form.Label>Unique Identification Number</Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="UID"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="text" name="uid"
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>

                          <Form.Label>Name</Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Name"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="text" name="name"
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>

                          <Form.Label>Email</Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Email"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="text" name="email"
                              onChange={this.handleChange.bind(this)}
                              />
                          </InputGroup>

                          <center><Button variant="light" id="but" type="submit" className="mr-2" onClick={this.registerAccount.bind(this)}> Register </Button></center>
                        </form>

                        <ul id="certList" className="list-unstyled">
                          { this.props.registrations.map((registration, key) => {
                            return (
                                      <div className ="registrationTemplate" key={key}>
                                        <label>
                                          <span className ="content text-white">{registration.content}</span>
                                        </label>
                                      </div>
                                  )
                                })}
                         </ul>

                        <p className="text-center"> Already registered? </p>
                        <center><Button variant="light" id="but" type="submit" className="mr-2" onClick = {this.loginAccount.bind(this)} >Login</Button></center> <br/><br/><br/><br/><br/>
          </div>
      );
  }
}

export default Register;
