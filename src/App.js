import './App.css';
import React, {Component} from 'react';
import TaskPool from './TaskPool'
import Web3 from 'web3';
import { useState } from 'react';


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
    const networkData = TaskPool.networks[networkId];
    console.log(networkData);
    if (networkData) {
      const deployedTaskPool = new web3.eth.Contract(TaskPool.abi, networkData.address);
      this.setState({deployedTaskPool: deployedTaskPool});

    }
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
      balance: 0 // for owner
    }
  }

  render() {
    return ""
  }


}

export default App;
