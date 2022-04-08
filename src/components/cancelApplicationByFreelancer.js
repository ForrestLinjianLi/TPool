import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class cancelApplicationByFreelancer extends Component {


    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            owner:this.props.owner,
        }
        this.getBalance = this.getBalance.bind(this);
        this.cancelApplication = this.cancelApplication.bind(this);
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

    cancelApplication() {
        this.state.contract.methods.cancelApplication(this.state.taskId)
            .send({from: this.state.owner})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            // this.getBalance();
        });


    }

    render() {
        return <div id="cancel-application-panel">
            <Form>
                <Form.Label>Cancel Application By Freelancer</Form.Label>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.taskId} placeholder="Enter Task ID You Want To Cancel" type="number" onChange={e => this.setState({taskId: e.target.value})}/>
                </Form.Group>

                <Button variant="primary" onClick={this.applyTask}>
                    Cancel Application
                </Button>
            </Form>


        </div>;
    }
}

export default cancelApplicationByFreelancer;