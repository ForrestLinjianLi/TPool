import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class AddNewTask extends Component {

    static defaultProps = {
        onBalanceChange: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            currentAddress: this.props.currentAddress,
        }
        this.createTask = this.createTask.bind(this);
    }

    componentDidMount() {
    }


    createTask() {
        this.state.contract.methods.createTask(window.web3.utils.toWei(this.state.price.toString(), 'Ether'), this.state.content)
            .send({from: this.state.currentAddress, value: ethers.utils.parseEther(this.state.price.toString())})
            .on("error", (error) => {
                console.log(error);
                window.alert("Only owner can create tasks!!!");
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.onBalanceChange();
            this.props.updateTask();
        });

    }

    render() {
        return <Container className={"panel"}>
            <Form>
                <h4>Create Task</h4>
                <Form.Group className="mb-3">
                    <Form.Control value={this.state.price} placeholder="Enter Price (ETH)" type="number"
                                  onChange={e => this.setState({price: e.target.value})}/>
                </Form.Group>
                <InputGroup style={{marginBottom:"10px"}}>
                    <FormControl placeholder="Enter Task Description" as="textarea" value={this.state.content}
                                 aria-label="With textarea" onChange={e => this.setState({content: e.target.value})}/>
                </InputGroup>

                <Button variant="primary" onClick={this.createTask}>
                    Add
                </Button>
            </Form>
        </Container>;
    }
}

export default AddNewTask;