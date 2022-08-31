import './App.css';
//fonts
import './font/JetBrainsMono-VariableFont_wght.ttf';
import React, {Component} from 'react';
import Web3 from 'web3';
import {Col, Container, Nav, Navbar, Row, Image} from "react-bootstrap";
import TaskListPanel from "./components/TaskListPanel";
import Button from 'react-bootstrap/Button';
import logo from './static/logo.png';
import taskCreater from './static/taskCreater.jpg';
import freelancer from './static/freelancer.jpg';
import OngoingTaskList from "./components/OngoingTaskList";
import UserPage from "./components/UserPage";
import FreelancerPage from "./components/FreelancerPage";

const TaskPool = require('./artifacts/contracts/taskPool.sol/TaskPool.json');
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
            task: null,
            appliedTasks: [],
            ongoingTasks: [],
            todoTasks: [],
            completedTasks: [],
            closedTasks: [],
            finishedTasks: [],
        }
        this.connectToBlockchain = this.connectToBlockchain.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.confirmTasksByOwner = this.confirmTasksByOwner.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.getCredit = this.getCredit.bind(this);
        this.onUpdateTask = this.onUpdateTask.bind(this);
        this.getOngoingTask = this.getOngoingTask.bind(this);
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.connectToBlockchain();
        await this.getBalance();
        await this.getCredit();
        await this.getOngoingTask();
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
        const deployedTaskPool = await new web3.eth.Contract(TaskPool.abi, tokenAddress);
        this.setState({
            contract: deployedTaskPool,
            currentAddress: accounts[0],
        })
        await this.onUpdateTask();
    }

    async onUpdateTask() {
        const deployedTaskPool = this.state.contract;
        const taskCount = parseInt(await deployedTaskPool.methods.counter().call());
        let todoTasks = [], ongoingTasks = [], appliedTasks = [], completedTasks = [], finishedTasks = [], closedTasks = [];
        const isOwner = await deployedTaskPool.methods.getOwnerAddress().call() === this.state.currentAddress;
        if (isOwner) {
            for (var i = 1; i <= taskCount; i++) {
                let task = await deployedTaskPool.methods.tasks(i).call();
                task.commissionFee = window.web3.utils.fromWei(task.commissionFee.toString(), 'ether');
                switch (task.status) {
                    case "1":
                        todoTasks.push(task);
                        break;
                    case "2":
                        ongoingTasks.push(task);
                        break;
                    case "3":
                        ongoingTasks.push(task);
                        break;
                    case "4":
                        closedTasks.push(task);
                        break;
                }
            }
        } else {
            const appliedTaskIds = await deployedTaskPool.methods.getAppliedTaskFreelancer(this.state.currentAddress).call();
            for (var i = 1; i <= taskCount; i++) {
                const task = await deployedTaskPool.methods.tasks(i).call();
                task.commissionFee = window.web3.utils.fromWei(task.commissionFee.toString(), 'ether');
                switch (task.status) {
                    case "1":
                        if (appliedTaskIds.includes(task.taskId)) {
                            appliedTasks.push(task)
                        }
                        todoTasks.push(task);
                        break;
                    case "3":
                        if (task.taker === this.state.currentAddress)
                            finishedTasks.push(task);
                    case "4":
                        if (task.taker === this.state.currentAddress)
                            completedTasks.push(task);
                }
            }
        }
        this.setState({
            todoTasks: todoTasks,
            ongoingTasks: ongoingTasks,
            appliedTasks: appliedTasks,
            completedTasks: completedTasks,
            finishedTasks: finishedTasks,
            closedTasks: closedTasks,
            count: taskCount + 1,
            isOwner: isOwner,
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
            this.onUpdateTask();
        }));
    }

    async getBalance() {
        let that = this;
        this.state.contract.methods.balanceOfContract().call().then(function (balance) {
            let temp = window.web3.utils.fromWei(balance.toString(), 'ether');
            that.setState({balance: temp})
        });
    }

    async getCredit() {
        let that = this;
        this.state.contract.methods.freelancers(this.state.currentAddress).call().then(function (freelancer) {
            let credit = freelancer.credit==="0"?100:freelancer.credit;
            that.setState({credit: credit})
        });
    }

    async getOngoingTask() {
        let that = this;
        await this.state.contract.methods.freelancers(this.state.currentAddress).call().then(async function (freelancer) {
            that.setState({task: freelancer.currentTaskId==="0"?null:
                    await that.state.contract.methods.tasks(freelancer.currentTaskId).call()});
        });
    }

    render() {
        return (<div className="App">
            <Navbar bg="dark" variant="dark">
                <Image src={logo} width={40} height={40} style={{marginLeft: "1vw"}}/>
                <Container>
                    <Navbar.Brand href="#home">TPool</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">About</Nav.Link>
                        <Nav.Link href="#pricing">Contact</Nav.Link>
                    </Nav>
                </Container>
                {this.state.isOwner ?
                    <Button variant="primary" disabled={true} style={{marginRight: "1vw"}}>Balance: {this.state.balance} ETH</Button> :
                    <div style={{display: "flex"}}>
                        <Button variant="primary" disabled={true} style={{marginRight: "1vw"}}>Credit
                            Score: {this.state.credit}</Button>
                        <Button variant={this.state.task?'primary':'danger'} disabled={true} style={{marginRight: "1vw"}}>
                            {this.state.task?`Ongoing Task ID: ${this.state.task.taskId}`:`No Ongoing Task`}</Button>
                    </div>
                }
            </Navbar>

            <Container>
                <Row>
                    <Col><TaskListPanel titles={["Todo Task List"]}
                                        colNames={["Task ID", "Price(ETH)"]}
                                        colTitle={["taskId", "commissionFee"]}
                                        col={2}
                                        rows={[this.state.todoTasks]}
                                        isTodo={true}
                                        apply={!this.state.isOwner}
                                        confirmTask={this.state.isOwner}
                                        currentAddress={this.state.currentAddress}
                                        updateTask={this.onUpdateTask}
                                        contract={this.state.contract}
                    /></Col>
                    {this.state.isOwner && this.state.contract && <Col>
                        <Image className="img-responsive" src={taskCreater} width="400" height="300"/>
                        <UserPage contract={this.state.contract}
                                  currentAddress={this.state.currentAddress}
                                  onCreditUpdate={this.getCredit}
                                  updateTask={this.onUpdateTask}
                                  onBalanceChange={this.getBalance}/>
                        <Container className="panel">
                            <h4>Confirm All Task Takers</h4>
                            <Button variant="primary" onClick={this.confirmTasksByOwner}>
                                Confirm
                            </Button>
                        </Container>

                    </Col>
                    }
                    {
                        !this.state.isOwner && this.state.contract &&
                        <Col>
                            <Image src={freelancer} className="img-responsive" width="150" height="150"/>
                            <FreelancerPage contract={this.state.contract}
                                            currentAddress={this.state.currentAddress}
                                            onCreditUpdate={this.getCredit}
                                            updateTask={this.onUpdateTask}
                                            task={this.state.task}
                                            updateOngoingTask={this.getOngoingTask}/>
                        </Col>
                    }
                    {
                        this.state.isOwner ? <Col><OngoingTaskList titles={["Ongoing Task List", "Closed Task List"]}
                                                                   colNames={["Task ID", "Price(ETH)", "Task Taker"]}
                                                                   col={2}
                                                                   rows={[this.state.ongoingTasks, this.state.closedTasks]}
                                                                   onCreditUpdate={this.getCredit}
                                                                   updateTask={this.onUpdateTask}
                                                                   contract={this.state.contract}
                                                                   currentAddress={this.state.currentAddress}
                                                                   onBalanceChange={this.getBalance}/></Col> :
                            <Col><TaskListPanel titles={["Applied Task List", "Finished Task List", "Completed Task List"]}
                                                colNames={["Task ID", "Price(ETH)"]}
                                                colTitle={["taskId", "commissionFee"]}
                                                col={2}
                                                cancelApplication
                                                rows={[this.state.appliedTasks, this.state.finishedTasks, this.state.completedTasks]}
                                                isTodo={false}
                                                contract={this.state.contract}
                                                currentAddress={this.state.currentAddress}
                                                updateTask={this.onUpdateTask}
                            /></Col>
                    }
                </Row>
            </Container>
        </div>)
    }
}

export default App;
