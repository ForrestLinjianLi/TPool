import './App.css';
// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
import Web3 from 'web3';
import { useState } from 'react';

const TaskPool = require('./artifacts/contracts/taskPool.sol/TaskPool.json');
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.connectToBlockchain();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  }

  async connectToBlockchain() {
    const web3 = window.web3;
    const accounts = web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const networkId = await web3.eth.net.getId();
    const deployedTaskPool = new web3.eth.Contract(TaskPool.abi, tokenAddress);
    this.setState({deployedTaskPool: deployedTaskPool});
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      todoTaskList: [], // for everyone; available tasks now
      applyingTasks: [], // only for freelancer
      onGoingTasksList: [], // only for owner
      loading: true,
      credit: null, // freelancer
      isOwner: false,
      currentTask: null, // for freelancer
      balance: 0, // for owner
    }
  }

  render() {
    return ""
  }


}

export default App;
