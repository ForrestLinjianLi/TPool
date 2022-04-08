import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class AddNewTask extends Component {

    static defaultProps = {
        onBalanceChange: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            owner:this.props.owner,
        }
        this.createTask = this.createTask.bind(this);
    }

    componentDidMount() {
    }



    createTask() {
        this.state.contract.methods.createTask(window.web3.utils.toWei(this.state.price.toString(), 'Ether'), this.state.content)
            .send({from: this.state.owner, value: ethers.utils.parseEther(this.state.price.toString())})
            .on("error", (error) => {
                console.log(error);
                window.alert("Only owner can create tasks!!!");
            }).on("receipt", (receipt) => {
                console.log(receipt);
                this.props.onBalanceChange();
            });

    }

    render() {
        return <div id="add-task-panel">

            <Form>
                <Form.Label>Create Task</Form.Label>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.price} placeholder="Enter Price (ETH)" type="number" onChange={e => this.setState({price: e.target.value})}/>
                </Form.Group>
                <InputGroup>
                    <FormControl placeholder="Enter Task Description" as="textarea"  value={this.state.content} aria-label="With textarea" onChange={e => this.setState({content:e.target.value})}/>
                </InputGroup>

                <Button variant="primary" onClick={this.createTask}>
                    Add
                </Button>
            </Form>

            {/*/!*<Button variant="secondary" onClick={this.createTask}>Add</Button>*!/*/}

            {/*<br></br>*/}
            {/*<InputGroup className="mb-3">*/}
            {/*    <InputGroup.Text>$</InputGroup.Text>*/}
            {/*    <FormControl aria-label="Amount (to the nearest dollar)"/>*/}
            {/*    <InputGroup.Text>.00</InputGroup.Text>*/}
            {/*</InputGroup>*/}

            {/*<InputGroup>*/}
            {/*    <InputGroup.Text>With textarea</InputGroup.Text>*/}
            {/*    <FormControl as="textarea" aria-label="With textarea"/>*/}
            {/*</InputGroup>*/}
            {/*<Button variant="secondary" onClick={this.createTask}>Add</Button>*/}

        </div>;
    }
}

export default AddNewTask;