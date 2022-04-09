import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Form} from "react-bootstrap";

class applyTaskByFreelancer extends Component {


    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            currentAddress:this.props.currentAddress,
        }
        this.getBalance = this.getBalance.bind(this);
        this.applyTask = this.applyTask.bind(this);
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
        this.state.contract.methods.applyTask(this.state.taskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.updateTask();
        });


    }

    render() {
        return <Container className="panel">
            <Form>
                <h4>Apply Task</h4>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.taskId} placeholder="Enter Task ID You Want To Apply" type="number" onChange={e => this.setState({taskId: e.target.value})}/>
                </Form.Group>

                <Button variant="primary" onClick={this.applyTask}>
                    Apply
                </Button>
            </Form>
        </Container>;
    }
}

export default applyTaskByFreelancer;