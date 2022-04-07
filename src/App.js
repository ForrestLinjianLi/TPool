import './App.css';
import {ethers} from 'ethers';
import React, {Component} from 'react';
import Web3 from 'web3';
import { useState } from 'react';
import AddNewTask from "./components/AddNewTask";

const TaskPool = require('./artifacts/contracts/taskPool.sol/TaskPool.json');
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

class App extends Component {
  componentDidMount() {
    this.loadWeb3();
    this.connectToBlockchain();
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
    const accounts = await web3.eth.getAccounts();
    const deployedTaskPool = new web3.eth.Contract(TaskPool.abi, tokenAddress);
    this.setState({
      contract: deployedTaskPool,
      owner: accounts[0]
    });
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
    this.connectToBlockchain = this.connectToBlockchain.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
  }

  render() {
    return (<div className="App">
      <AddNewTask contract={this.state.contract} owner={this.state.owner}/>
    </div>)
  }


}

export default App;
