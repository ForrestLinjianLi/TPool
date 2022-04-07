import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class AddNewTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            owner:this.props.owner,
        }
        this.getBalance = this.getBalance.bind(this);
        this.createTask = this.createTask.bind(this);
    }

    componentDidMount() {
        this.getBalance();
    }

    async getBalance() {
        let that = this;
        this.state.contract.methods.balanceOfContract().call().then(function (balance) {
            that.setState({balance: balance})
        });
    }

    async createTask() {
        const balance = await this.state.contract.methods.createTask(100000000000, "asdasdsa")
            .send({from: this.state.owner, value: ethers.utils.parseEther("100.0")})
            .on("error", (error) => {
                console.log(error);
            }).on("receipt", (recript) => {
                console.log(recript)
            });
    }

    render() {
        return <div id="add-task-panel">
            <Button variant="primary" disabled={true}>Company Balance: {this.state.balance}</Button>

            <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl aria-label="Amount (to the nearest dollar)"/>
                <InputGroup.Text>.00</InputGroup.Text>
            </InputGroup>

            <InputGroup>
                <InputGroup.Text>With textarea</InputGroup.Text>
                <FormControl as="textarea" aria-label="With textarea"/>
            </InputGroup>
            <Button variant="secondary" onClick={this.createTask}>Add</Button>

        </div>;
    }
}

export default AddNewTask;