import './App.css';
//fonts
import './font/JetBrainsMono-VariableFont_wght.ttf';
import React, {Component} from 'react';
import Web3 from 'web3';
import AddNewTask from "./components/AddNewTask";
import CancelTask from "./components/CancelTask";
import {Col, Container, Nav, Navbar, Row, Image} from "react-bootstrap";
import ListPanel from "./components/ListPanel";
import Button from 'react-bootstrap/Button';
import logo from './static/logo.png';
import taskCreater from './static/taskCreater.jpg';
import freelancer from './static/freelancer.jpg';
import ApplyTask from "./components/applyTaskByFreelancer";
import CancelApplication from "./components/cancelApplicationByFreelancer";
import FinishTaskByFreelancer from "./components/FinishTaskByFreelancer";
import ConfirmFinishedTaskByOwner from "./components/ConfirmFinishedTaskByOwner";
import CancelOngoingTaskByFreelancer from "./components/CancelOngoingTaskByFreelancer";

const TaskPool = require('./artifacts/contracts/taskPool.sol/TaskPool.json');
const tokenAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

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
        this.onUpdateTask = this.onUpdateTask.bind(this);
        this.getOngoingTaskId = this.getOngoingTaskId.bind(this);
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.connectToBlockchain();
        this.getBalance();
        this.getCredit();
        this.getOngoingTaskId();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    }

    async connectToBlockchain() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const deployedTaskPool = new web3.eth.Contract(TaskPool.abi, tokenAddress);
        this.setState({
            contract: deployedTaskPool,
            currentAddress: accounts[0],
        })
        await this.onUpdateTask();
    }

    async onUpdateTask() {
        const deployedTaskPool = this.state.contract;
        const taskCount = await deployedTaskPool.methods.counter().call();
        let todoTasks = [], ongoingTasks = [], appliedTasks = [], finishedTasks = [];
        const isOwner = await deployedTaskPool.methods.getOwnerAddress().call() === this.state.currentAddress;
        if (isOwner) {
            for (var i = 1; i <= taskCount; i++) {
                const task = await deployedTaskPool.methods.tasks(i).call();
                switch (task.status) {
                    case "1":
                        todoTasks.push([task.taskId, window.web3.utils.fromWei(task.commissionFee.toString(), 'ether')]);
                        break;
                    case "2":
                        ongoingTasks.push([task.taskId, window.web3.utils.fromWei(task.commissionFee.toString(), 'ether'), task.taker]);
                        break;
                    case "3":
                        finishedTasks.push([task.taskId, window.web3.utils.fromWei(task.commissionFee.toString(), 'ether'), task.taker]);
                }
            }
        } else {
            const appliedTaskIds = await deployedTaskPool.methods.getAppliedTaskFreelancer(this.state.currentAddress).call();
            for (var i = 1; i <= taskCount; i++) {
                const task = await deployedTaskPool.methods.tasks(i).call();
                switch (task.status) {
                    case "1":
                        if (appliedTaskIds.includes(task.taskId)) {
                            appliedTasks.push([task.taskId, window.web3.utils.fromWei(task.commissionFee.toString(), 'ether')])
                        }
                        todoTasks.push([task.taskId, window.web3.utils.fromWei(task.commissionFee.toString(), 'ether')]);
                        break;
                    case "3":
                        finishedTasks.push([task.taskId, window.web3.utils.fromWei(task.commissionFee.toString(), 'ether'), task.taker]);
                }
            }
        }
        this.setState({
            todoTasks: todoTasks,
            ongoingTasks: ongoingTasks,
            appliedTasks: appliedTasks,
            finishedTasks: finishedTasks,
            count: taskCount + 1,
            isOwner: isOwner ,
        })
    }

    confirmTasksByOwner() {
        this.state.contract.methods.confirmTaskTakers()
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error.message);
                window.alert(error.message);
            }).on("receipt", (receipt => {
            console.log(receipt);
            // this.onUpdateTask();
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
        this.state.contract.methods.freelancers(this.state.currentAddress).call().then(function (freelancer) {
            let credit = freelancer.credit;
            that.setState({credit: credit})
        });
    }

    getOngoingTaskId() {
        let that = this;
        this.state.contract.methods.freelancers(this.state.currentAddress).call().then(function (freelancer) {
            let ongoingTaskId = freelancer.currentTaskId;
            if (ongoingTaskId == 0)  ongoingTaskId=null;
            that.setState({taskId: ongoingTaskId})
        });
    }

    render() {
        return (<div className="App">
            <Navbar bg="dark" variant="dark">
                <Image src={logo} width={40} height={40} style={{marginLeft:"1vw"}}/>
                <Container>
                    <Navbar.Brand href="#home">TPool</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">About</Nav.Link>
                        <Nav.Link href="#pricing">Contact</Nav.Link>
                    </Nav>
                </Container>
                {this.state.isOwner ?
                    <Button variant="primary" disabled={true} style={{marginRight: "1vw"}}>Company
                        Balance: {this.state.balance} ETH</Button> :
                    <div style={{display:"flex"}}>
                        <Button variant="primary" disabled={true} style={{marginRight: "1vw"}}>Credit
                            Score: {this.state.credit}</Button>
                        <Button variant="primary" disabled={true} style={{marginRight: "1vw"}}>Ongoing Task ID: {this.state.taskId}</Button>
                    </div>
                }
            </Navbar>

            <Container >
                <Row>
                    <Col><ListPanel title="Todo Task List"
                                    colNames={["Task ID", "Price(ETH)"]}
                                    col={2}
                                    rows={this.state.todoTasks}/></Col>
                    {this.state.isOwner && this.state.contract && <Col>
                        <Image className="img-responsive" src={taskCreater} width="400" height="300"/>
                        <AddNewTask contract={this.state.contract}
                                    currentAddress={this.state.currentAddress}
                                    updateTask={this.onUpdateTask}
                                    onBalanceChange={this.getBalance}/>
                        <CancelTask contract={this.state.contract}
                                    currentAddress={this.state.currentAddress}
                                    updateTask={this.onUpdateTask}
                                    onBalanceChange={this.getBalance}/>
                        <ConfirmFinishedTaskByOwner contract={this.state.contract}
                                                    currentAddress={this.state.currentAddress}
                                                    onCreditUpdate={this.getCredit}
                                                    onBalanceChange={this.getBalance}/>
                        <Button variant="primary" onClick={this.confirmTasksByOwner}>
                            Click to Confirm Task Takers
                        </Button>
                    </Col>
                    }
                    {
                        !this.state.isOwner && this.state.contract &&
                        <Col>
                            <Image src={freelancer} className="img-responsive" width="150" height="150"/>

                            <ApplyTask contract={this.state.contract}
                                       currentAddress={this.state.currentAddress}
                                       updateTask={this.onUpdateTask}/>
                            <CancelApplication contract={this.state.contract}
                                               currentAddress={this.state.currentAddress}
                                               updateTask={this.onUpdateTask}/>
                            <CancelOngoingTaskByFreelancer contract={this.state.contract}
                                               currentAddress={this.state.currentAddress}
                                               onCreditUpdate={this.getCredit}
                                               updateTask={this.onUpdateTask}/>
                            <FinishTaskByFreelancer contract={this.state.contract}
                                                    currentAddress={this.state.currentAddress}
                                                    updateTask={this.onUpdateTask}/>
                        </Col>
                    }
                    {
                        this.state.isOwner ? <Col><ListPanel title="Ongoing Task List"
                                                             colNames={["Task ID", "Price(ETH)", "Task Taker"]}
                                                             col={3}
                                                             rows={this.state.ongoingTasks}/></Col> :
                            <Col><ListPanel title="Applied Task List"
                                            colNames={["Task ID", "Price(ETH)"]}
                                            col={2}
                                            rows={this.state.appliedTasks}/></Col>
                    }

                </Row>
            </Container>
        </div>)
    }
}

export default App;
