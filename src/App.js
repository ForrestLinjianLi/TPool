import './App.css';
import {ethers} from 'ethers';
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
    this.createTask = this.createTask.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  async createTask() {
    const balance = await this.state.contract.methods.createTask(100000000000, "asdasdsa")
        .send({ from: this.state.owner, value : ethers.utils.parseEther("100.0")})
        .on("error", (error) => {
      console.log(error);
    }).on("receipt", (recript) => {
      console.log(recript)
        });
  }

  async getBalance() {
    const balance = await this.state.contract.methods.balanceOfContract().call().then(function(balance) {
      console.log("Account Balance: ", balance);
      return balance;
    });
    console.log(balance);
  }


  render() {
    return (<div className="App">
      <header className="App-header">
        <button onClick={this.createTask}>create task</button>
        <button onClick={this.getBalance}>Get Balance</button>
      </header>
    </div>)
  }


}

export default App;
