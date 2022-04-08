import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Form, FormControl, InputGroup} from "react-bootstrap";
import {ethers} from "ethers";

class CancelTask extends Component {

    static defaultProps = {
        onBalanceChange: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            owner:this.props.owner,
        }
        this.cancelTask = this.cancelTask.bind(this);
    }

    componentDidMount() {
    }


    cancelTask() {
        this.state.contract.methods.cancelTaskByOwner(this.state.taskId)
            .send({from: this.state.owner})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (recript) => {
            console.log(recript);
            this.props.onBalanceChange();
            });
    }

    render() {
        return <div id="cancel-task-panel">
            <Form>
                <Form.Label>Cancel Task</Form.Label>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.taskId} placeholder="Enter Task ID" type="number" onChange={e => this.setState({taskId: e.target.value})}/>
                </Form.Group>

                <Button variant="primary" onClick={this.cancelTask}>
                    Cancel
                </Button>
            </Form>


        </div>;
    }
}

export default CancelTask;