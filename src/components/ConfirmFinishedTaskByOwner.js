import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class ConfirmFinishedTaskByOwner extends Component {

    static defaultProps = {
        onBalanceChange: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            currentAddress:this.props.currentAddress,
        }
        this.confirmFinishedTask = this.confirmFinishedTask.bind(this);
    }

    componentDidMount() {
    }


    confirmFinishedTask() {
        this.state.contract.methods.confirmFinishedTask(this.state.taskId)
            .send({from: this.state.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.onBalanceChange();
        });


    }

    render() {
        return <Container className="panel">
            <Form>
                <h4>Confirm Finished Task</h4>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.taskId} placeholder="Enter Task ID You Want to Confirm that is Finished" type="number" onChange={e => this.setState({taskId: e.target.value})}/>
                </Form.Group>
                <Button variant="primary" onClick={this.confirmFinishedTask}>
                    Confirm
                </Button>
            </Form>
        </Container>;
    }
}

export default ConfirmFinishedTaskByOwner;