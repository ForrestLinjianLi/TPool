import './App.css';
import {ethers} from 'ethers';
import React, {Component} from 'react';
import Web3 from 'web3';
import AddNewTask from "./components/AddNewTask";
import CancelTask from "./components/CancelTask";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";
import ListPanel from "./components/ListPanel";
import Button from 'react-bootstrap/Button';


import ApplyTask from "./components/applyTaskByFreelancer";
import CancelApplication from "./components/cancelApplicationByFreelancer";
import FinishTaskByFreelancer from "./components/FinishTaskByFreelancer";
import ConfirmFinishedTaskByOwner from "./components/ConfirmFinishedTaskByOwner";

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
    this.confirmTasksByOwner = this.confirmTasksByOwner.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.getCredit = this.getCredit.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.connectToBlockchain();
    this.getBalance();
    this.getCredit();
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

  confirmTasksByOwner() {
    this.state.contract.methods.confirmTaskTakers()
        .send({from: this.state.owner})
        .on("error", (error) => {
          console.log(error.message);
          window.alert(error.message);
        }).on("receipt", (receipt => {
          console.log(receipt);
    }));
  }

  async getBalance() {
    let that = this;
    this.state.contract.methods.balanceOfContract().call().then(function (balance) {
      let temp = window.web3.utils.fromWei(balance.toString(), 'ether');
      that.setState({balance: temp})
    });
  }

  getCredit() {
    let that = this;
    this.state.contract.methods.freelancers(this.state.owner).call().then(function (freelancer) {
      let credit = freelancer.credit;
      that.setState({credit: credit})
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
        <Button variant="primary" disabled={true}>Company Balance: {this.state.balance} ETH</Button>

        <Button variant="primary" disabled={true}>Freelancer Credit: {this.state.credit}</Button>

        <Row>
          <Col><ListPanel title="Todo Task List" colNames={["Task ID", "Price"]}/></Col>
          <Col>{this.state.contract && <AddNewTask contract={this.state.contract} owner={this.state.owner} onBalanceChange={this.getBalance}/>}
            {this.state.contract && <CancelTask contract={this.state.contract} owner={this.state.owner} onBalanceChange={this.getBalance}/>}
            <Button variant="primary" onClick={this.confirmTasksByOwner}>
              Click to Confirm Task Takers
            </Button>

            {this.state.contract && <ApplyTask contract={this.state.contract} owner={this.state.owner}/>}
            {this.state.contract && <CancelApplication contract={this.state.contract} owner={this.state.owner}/>}
            {this.state.contract && <FinishTaskByFreelancer contract={this.state.contract} owner={this.state.owner}/>}
            {this.state.contract && <ConfirmFinishedTaskByOwner contract={this.state.contract} owner={this.state.owner} onBalanceChange={this.getBalance}/>}
          </Col>
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
