import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import paper from '../paper3.jpeg';
import Web3 from 'web3';
import './App.css';
import Certify from '../abis/Certify.json';
// import Certificate from '../abis/Certificate.json';

import Register from "./Register.js"
import Navbar from "./Navbar.js"
import swal from 'sweetalert';
// import UniversityLogin from "./UniversityLogin";
// import StudentLogin from "./StudentLogin"


class App extends Component {

async componentWillMount() {
  await this.loadWeb3()
  await this.loadBlockchainData()
}

async loadBlockchainData() {
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })
  const networkId = await web3.eth.net.getId()
  console.log("NetworkID:  ", networkId);
  const networkData = Certify.networks[networkId]
    console.log("NetworkData:  ", networkData);
  // const networkData1 = Certificate.networks[networkId]
  //   console.log("NetworkData1:  ", networkData1);

  if(networkData) {
    const abi = Certify.abi
    const address = networkData.address
    const contractR = web3.eth.Contract(abi, address)
    this.setState({ contractR })
    console.log("Certify: ", this.state.contractR)
    const registrationCount = await contractR.methods.registrationCount().call()
    for (var i = 1; i<= registrationCount; i++) {
      const registration = await contractR.methods.students(i).call()
      this.setState({
        registrations: [...this.state.registrations, registration]
      })
    } console.log(" Registrations: ", this.state.registrations)
    const globalCertCount = await contractR.methods.globalCertCount().call()
    console.log("Global Cert Count: ", globalCertCount)
    for (var j = 1; j<= globalCertCount; j++) {
      const certificate = await contractR.methods.certificates(j).call()
      this.setState({
        certificates: [...this.state.certificates, certificate]
      })
    } console.log('Certificates: ', this.state.certificates)
    const companyCertCount = await contractR.methods.companyCertCount().call()
    for(var k =1; k<=companyCertCount; k++) {
      const companyCert = await contractR.methods.companyCert(k).call()
      this.setState({
        companyCerts: [...this.state.companyCerts, companyCert]
      })
    }console.log('Company Certificates: ', this.state.companyCerts)
    this.setState({ loading: false})
  } else {
    window.alert('Smart contract not deployed to the detected network!')
  }

  // if(networkData1) {
  //   const abi1 = Certificate.abi
  //   const address1 = networkData1.address
  //   const contractC = web3.eth.Contract(abi1, address1)
  //   this.setState({ contractC })
  //   console.log("Certificate: ", this.state.contractC)
  //   const globalCertCount = await contractC.methods.globalCertCount().call()
  //   console.log("Global Cert Count: ", globalCertCount.toNumber())
  //   for (var j = 1; j<= globalCertCount; j++) {
  //     const certificate = await contractC.methods.certificates(j).call()
  //     this.setState({
  //       certificates: [...this.state.certificates, certificate]
  //     })
  //   } console.log('Certificates: ', this.state.certificates)
  // }
  // else {
  //   window.alert('Smart contractC not deployed to the detected network!')
  // }
}

constructor(props) {
  super(props);
  this.state = {
    account: '',
    registrations: [],
    contractR: null,
    certificates: [],
    contractC: null,
    show: false,
    showLogin: false,
    loading: true,
    showRegister: false,
    companyCerts: []
  };
}


 async loadWeb3() {
   if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
   } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
   } else {
      window.alert("Please use metamask!")
   }
 }


  render() {
    const props = { account: this.state.account, contractR: this.state.contractR , companyCerts:this.state.companyCerts,  uid: this.state.uid, showLogin: this.state.showLogin, certificates: this.state.certificates, registrations: this.state.registrations}
    return (
      // await this.renderTasks()
      <div>
        <Navbar account={this.state.account}/>
                 { this.state.loading
                  ?  <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <Register contractR = {this.state.contractR} account = {this.state.account} companyCerts = {this.state.companyCerts} registrations = {this.state.registrations} showLogin = {this.state.showLogin} loading = {this.state.loading} {...props} />
                   }

      </div>
    );
  }
}

export default App;
