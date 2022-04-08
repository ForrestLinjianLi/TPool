import './App.css';
import {ethers} from 'ethers';
import React, {Component} from 'react';
import Web3 from 'web3';
import { useState } from 'react';
import AddNewTask from "./components/AddNewTask";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";
import ListPanel from "./components/ListPanel";

const TaskPool = require('./artifacts/contracts/taskPool.sol/TaskPool.json');
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

class App extends Component {

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

  render() {
    return (<div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col><ListPanel title="Todo Task List" colNames={["Task ID", "Price"]}/></Col>
          <Col>{this.state.contract && <AddNewTask contract={this.state.contract} owner={this.state.owner}/>}</Col>
          <Col><ListPanel title="Ongoing Task List"/></Col>
        </Row>
      </Container>
      <Container>

      </Container>
      <br />
    </div>)
  }


}

export default App;
