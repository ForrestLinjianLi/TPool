import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class CancelOngoingTaskByFreelancer extends Component {


    static defaultProps = {
        onCreditUpdate: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            currentAddress:this.props.currentAddress,
        }
        this.getBalance = this.getBalance.bind(this);
        this.cancelOngoingTask = this.cancelOngoingTask.bind(this);
        this.getOngoingTaskId = this.getOngoingTaskId.bind(this);
    }

    componentDidMount() {
        this.getBalance();
        this.getOngoingTaskId();
    }

    async getBalance() {
        let that = this;
        this.state.contract.methods.balanceOfContract().call().then(function (balance) {
            let temp = window.web3.utils.fromWei(balance.toString(), 'ether');
            that.setState({balance: temp})
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

    cancelOngoingTask() {

        this.state.contract.methods.cancelOngoingTaskByFreelancer(this.state.taskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.onCreditUpdate();
            this.getOngoingTaskId();
            this.props.updateTask();
        });


    }

    render() {
        return <Container className="panel">
            <Form>
                <h4>Cancel Ongoing Task</h4>
                {/*<Form.Group className="mb-3" >*/}
                {/*    <Form.Control value={this.state.taskId} placeholder="Enter Task ID You Want To Cancel" type="number" onChange={e => this.setState({taskId: e.target.value})}/>*/}
                {/*</Form.Group>*/}
                <Button variant="primary" onClick={this.cancelOngoingTask} required>
                    Cancel
                </Button>
            </Form>


        </Container>;
    }
}

export default CancelOngoingTaskByFreelancer;