import React, {Component} from 'react';
import {Modal, Col, Container, ListGroup, Row, Badge} from "react-bootstrap";
import Button from "react-bootstrap/Button";


class TaskListPanel extends Component {
    static defaultProps = {
        col: 1,
        colNames: ["col1", "col2"],
        colTitle: [],
        title: "title",
        rows: [],
        currentTask: null,
        isTodo: true,
    }

    constructor(props) {
        super(props);
        this.state = {
            show:false,
            handleClose:false
        }
        this.target = React.createRef();
        this.onProcess = this.onProcess.bind(this);
    }

    onProcess() {
        let method;
        if (this.props.apply) {
            method = this.props.contract.methods.applyTask(this.state.currentTask.taskId);
        } else if (this.props.cancelApplication) {
            method = this.props.contract.methods.cancelApplication(this.state.currentTask.taskId);
        } else if (this.props.confirmTask) {
            method = this.props.contract.methods.confirmTaskTakersById(this.state.currentTask.taskId);
        }

        if (method !== null) {
            method.send({from: this.props.currentAddress})
                .on("error", (error) => {
                    console.log(error);
                    window.alert(error.message);
                }).on("receipt", (receipt) => {
                    console.log(receipt);
                    this.props.updateTask();
                });
        }
    }

    getProcessButtonText() {
        if (this.props.apply) {
            return "Apply";
        } else if (this.props.cancelApplication) {
            return "Cancel Application";
        } else if (this.props.confirmTask) {
            return "Confirm";
        }
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={() => this.setState({show:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Task ID {this.state.currentTask && this.state.currentTask.taskId}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col xs={4} md={5} style={{fontWeight: 'bold'}}>
                                    Task Description:
                                </Col>
                                <Col xs={6} md={7} style={{wordWrap: "break-word"}}>
                                    {this.state.currentTask && this.state.currentTask.description}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col xs={4} md={5} style={{fontWeight: 'bold'}}>
                                    Status:
                                </Col>
                                <Col xs={6} md={7} style={{wordWrap: "break-word"}}>
                                    {this.state.currentTask && this.state.currentTask.status}
                                </Col>
                            </Row>
                        </Container></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({show:false})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.setState({
                                show:false
                            });
                            this.onProcess();
                        }}>
                            {this.getProcessButtonText()}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <label style={{backgroundColor: "#f5cb42", borderRadius: "10px"}}>{this.props.title}</label>
                <Container style={{backgroundColor: "grey"}}>
                    <Row sm={this.props.col} style={{padding: "10px"}}>
                        {this.props.colNames.map((cn, i) => {
                            return (
                                <Col>
                                    <label style={{marginBottom: "10px"}}>{cn}</label>
                                    <ListGroup>
                                        {this.props.rows && this.props.rows.map((r,j) => {
                                            if (i === 0) {
                                                return <ListGroup.Item
                                                    action
                                                    style={{backgroundColor: "#3f8b96", color: "white"}}
                                                    ref={this.target}
                                                    onClick={() => this.setState({show:true, currentTask:this.props.rows[j]})}>
                                                    {r[this.props.colTitle[i]]}
                                                    <Badge bg={"primary"} pill>{r.applierCount}</Badge>
                                                </ListGroup.Item>
                                            } else {
                                                return <ListGroup.Item style={{
                                                    backgroundColor: "#3f8b96",
                                                    color: "white"
                                                }}>{r[this.props.colTitle[i]]}
                                                </ListGroup.Item>
                                            }
                                        })}
                                    </ListGroup>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default TaskListPanel;