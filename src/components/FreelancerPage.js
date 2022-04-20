import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Col, Container, Form, Row} from "react-bootstrap";

class applyTaskByFreelancer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            currentAddress: this.props.currentAddress,
        }
        this.getBalance = this.getBalance.bind(this);
        this.applyTask = this.applyTask.bind(this);
        this.cancelApplication = this.cancelApplication.bind(this);
        this.finishTask = this.finishTask.bind(this);
        this.cancelOngoingTask = this.cancelOngoingTask.bind(this);
    }

    componentDidMount() {
        this.getBalance();
    }

    async getBalance() {
        let that = this;
        this.state.contract.methods.balanceOfContract().call().then(function (balance) {
            let temp = window.web3.utils.fromWei(balance.toString(), 'ether');
            that.setState({balance: temp})
        });
    }

    applyTask() {
        this.state.contract.methods.applyTask(this.state.applyTaskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.updateTask();
        });
        this.setState({applyTaskId: ""});
    }

    cancelApplication() {
        this.state.contract.methods.cancelApplication(this.state.cancelTaskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.updateTask();
        });
        this.setState({cancelTaskId: ""});
    }

    finishTask() {
        this.state.contract.methods.finishTask(this.props.task.taskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            this.props.onCreditUpdate();
            this.props.updateOngoingTask();
        });
    }

    async cancelOngoingTask() {
        this.state.contract.methods.cancelOngoingTaskByFreelancer(this.props.task.taskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", async (receipt) => {
            console.log(receipt);
            this.props.onCreditUpdate();
            this.props.updateOngoingTask();
            this.props.updateTask();
            const appliers = await this.state.contract.methods.getApplierTasks(this.state.taskId).call();
            console.log(appliers);
        });


    }

    render() {
        return <div>
            {this.props.task ? <div>
                    <Container className="panel">
                        <h4>Current Task</h4>
                            <Row>
                                <Col xs={6} md={5} style={{fontWeight: 'bold'}}>
                                    Task Taker Address:
                                </Col>
                                <Col xs={6} md={7} style={{wordWrap: "break-word"}}>
                                    {this.props.task.taker}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col xs={4} md={5} style={{fontWeight: 'bold'}}>
                                    Task Description:
                                </Col>
                                <Col xs={6} md={7} style={{wordWrap: "break-word"}}>
                                    {this.props.task.description}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col xs={4} md={5} style={{fontWeight: 'bold'}}>
                                    Status:
                                </Col>
                                <Col xs={6} md={7} style={{wordWrap: "break-word"}}>
                                    {this.props.task.status==="2" && "Please click finish once you have done the task."}
                                    {this.props.task.status==="3" && "Waiting for the task creator to confirm."}
                                </Col>
                            </Row>
                    </Container>
                    <Container className="panel">
                        <Form className="position-relative">
                            <h4>Finish Ongoing Task</h4>
                            <Button variant="primary" onClick={this.finishTask}>
                                Finish
                            </Button>
                        </Form>
                    </Container>
                    <Container className="panel">
                        <Form>
                            <h4>Cancel Ongoing Task</h4>
                            <Button variant="primary" onClick={this.cancelOngoingTask} required>
                                Cancel
                            </Button>
                        </Form>
                    </Container>
                </div> :
                <div>
                    <Container className="panel">
                        <Form>
                            <h4>Apply Task</h4>
                            <Form.Group className="mb-3">
                                <Form.Control value={this.state.applyTaskId}
                                              placeholder="Enter Task ID You Want To Apply" type="number"
                                              onChange={e => this.setState({applyTaskId: e.target.value})}/>
                            </Form.Group>

                            <Button variant="primary" onClick={this.applyTask}>
                                Apply
                            </Button>
                        </Form>
                    </Container>
                    <Container className="panel">
                        <Form>
                            <h4>Cancel Application</h4>
                            <Form.Group className="mb-3">
                                <Form.Control value={this.state.cancelTaskId}
                                              placeholder="Enter Task ID You Want To Cancel" type="number"
                                              onChange={e => this.setState({cancelTaskId: e.target.value})}/>
                            </Form.Group>

                            <Button variant="primary" onClick={this.cancelApplication} required>
                                Cancel
                            </Button>
                        </Form>
                    </Container>
                </div>
            }
        </div>;
    }
}

export default applyTaskByFreelancer;