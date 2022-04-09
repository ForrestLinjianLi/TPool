import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Form, FormControl, InputGroup} from "react-bootstrap";

class cancelApplicationByFreelancer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contract: this.props.contract,
            currentAddress:this.props.currentAddress,
        }
        this.cancelApplication = this.cancelApplication.bind(this);
    }

    cancelApplication() {
        this.state.contract.methods.cancelApplication(this.state.taskId)
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
                <h4>Cancel Application</h4>
                <Form.Group className="mb-3" >
                    <Form.Control value={this.state.taskId} placeholder="Enter Task ID You Want To Cancel" type="number" onChange={e => this.setState({taskId: e.target.value})}/>
                </Form.Group>

                <Button variant="primary" onClick={this.cancelApplication} required>
                    Cancel
                </Button>
            </Form>


        </Container>;
    }
}

export default cancelApplicationByFreelancer;