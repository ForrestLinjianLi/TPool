import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class ConfirmFinishedTaskByOwner extends Component {

    static defaultProps = {
        onBalanceChange: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            owner:this.props.owner,
        }
        this.confirmFinishedTask = this.confirmFinishedTask.bind(this);
    }

    componentDidMount() {
    }


    confirmFinishedTask() {
        this.state.contract.methods.confirmFinishedTask(this.state.taskId)
            .send({from: this.state.owner})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.onBalanceChange();
        });


    }

    render() {
        return <div id="confirm-task-panel">
            <Form>
                <Form.Label>Confirm Finished Task By Owner</Form.Label>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.taskId} placeholder="Enter Task ID You Want to Confirm that is Finished" type="number" onChange={e => this.setState({taskId: e.target.value})}/>
                </Form.Group>

                <Button variant="primary" onClick={this.confirmFinishedTask}>
                    Click to Confirm Completion
                </Button>
            </Form>


        </div>;
    }
}

export default ConfirmFinishedTaskByOwner;