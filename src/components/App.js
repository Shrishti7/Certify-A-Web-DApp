import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import paper from '../paper3.jpeg';
import Web3 from 'web3';
import './App.css';
import Certify from '../abis/Certify.json';
import Certificate from '../abis/Certificate.json';

import Register from "./Register.js"
import Navbar from "./Navbar.js"


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
  const networkData1 = Certificate.networks[networkId]
    console.log("NetworkData1:  ", networkData1);

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
    this.setState({ loading: false})
  } else {
    window.alert('Smart contractR not deployed to the detected network!')
  }

  if(networkData1) {
    const abi1 = Certificate.abi
    const address1 = networkData1.address
    const contractC = web3.eth.Contract(abi1, address1)
    this.setState({ contractC })
    console.log("Certificate: ", this.state.contractC)
  }
}

constructor(props) {
  super(props);
  this.state = {
    account: '',
    registrations: [],
    contractR: null,
    contractC: null,
    show: false,
    loading: true,
    showRegister: false
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
    return (
      // await this.renderTasks()
      <div className="bod">
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row" >
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Certify</h1>
                 { this.state.loading
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <Register contractR = {this.state.contractR} show = {this.state.show} account = {this.state.account} registrations = {this.state.registrations} loading = {this.state.loading}/>
                   }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
