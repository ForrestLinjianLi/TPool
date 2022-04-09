import React, {Component} from 'react';
import {OverlayTrigger, Popover, Col, Container, ListGroup, Row, Modal, Badge, ModalFooter} from "react-bootstrap";
import Button from "react-bootstrap/Button";


class ListPanel extends Component {
    static defaultProps = {
        title: "title",
        tasks: [],
    }

    constructor(props) {
        super(props);
        this.state = {
            show:false,
            handleClose:false
        }
        this.target = React.createRef();
        this.confirmFinishedTask = this.confirmFinishedTask.bind(this);
    }

    confirmFinishedTask() {
        this.props.contract.methods.confirmFinishedTask(this.state.currentTask.taskId)
            .send({from: this.props.currentAddress})
            .on("error", (error) => {
                console.log(error);
                window.alert(error.message);
            }).on("receipt", (receipt) => {
            console.log(receipt);
            this.props.onCreditUpdate();
            this.props.onBalanceChange();
            this.props.updateTask();
        });
    }


    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={() => this.setState({show:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Task ID {this.state.currentTask && this.state.currentTask.taskId}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid">{this.state.currentTask && <div>
                        <Container>
                            <Row>
                                <Col xs={6} md={5} style={{fontWeight: 'bold'}}>
                                    Task Taker Id:
                                </Col>
                                <Col xs={6} md={7} style={{wordWrap: "break-word"}}>
                                    {this.state.currentTask && this.state.currentTask.taker}
                                </Col>
                            </Row>
                            <br/>
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
                        </Container>
                    </div>}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({show:false})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.setState({
                                show:false
                            });
                            this.confirmFinishedTask();
                        }}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <label style={{backgroundColor: "#f5cb42", borderRadius: "10px"}}>{this.props.title}</label>
                <Container style={{backgroundColor: "grey"}}>
                    <Row sm={this.props.col} style={{padding: "10px"}}>
                        <Col>
                            <label style={{marginBottom: "10px"}}>Task ID</label>
                            <ListGroup>
                                {this.props.rows && this.props.rows.map((task,i) => {
                                    return <ListGroup.Item
                                        action
                                        style={{backgroundColor: "#3f8b96", color: "white"}}
                                        ref={this.target}
                                        onClick={() => this.setState({show:true, currentTask:task})}>
                                        {task.taskId}
                                        {task.status==="3" ? <Badge bg={"danger"} pill>!</Badge>:""}
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Col>
                        <Col>
                            <label style={{marginBottom: "10px"}}>Price (ETH)</label>
                            <ListGroup>
                                {this.props.rows && this.props.rows.map(task => {
                                    return <ListGroup.Item
                                        style={{backgroundColor: "#3f8b96", color: "white"}}
                                        onClick={this.onClickPopover}>
                                        {task.commissionFee}
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ListPanel;