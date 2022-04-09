import React, {Component} from 'react';
import {OverlayTrigger, Popover, Col, Container, ListGroup, Row} from "react-bootstrap";


class ListPanel extends Component {
    static defaultProps = {
        col: 1,
        colNames: ["col1", "col2"],
        title: "title",
    }

    constructor(props) {
        super(props);
        this.onClickPopover = this.onClickPopover.bind(this);
    }

    onClickPopover(e) {
        const taskId = e.target.getAttribute("taskId");
        const taskDescription = e.target.getAttribute("taskDescription");
    }

    render() {
        return (
            <div>
                <label style={{backgroundColor: "#f5cb42", borderRadius: "10px"}}>{this.props.title}</label>
                <Container style={{backgroundColor: "grey"}}>
                    <Row sm={this.props.col} style={{padding: "10px"}}>
                        {this.props.colNames.map((cn, i) => {
                            return (
                                <Col>
                                    <label style={{marginBottom: "10px"}}>{cn}</label>
                                    <ListGroup>
                                        {this.props.rows && this.props.rows.map(r => {
                                            if (i === 0) {
                                                return <ListGroup.Item
                                                    action
                                                    style={{backgroundColor: "#3f8b96", color: "white"}}
                                                onClick={this.onClickPopover}>
                                                    {r[i]}
                                                </ListGroup.Item>
                                            } else {
                                                return <ListGroup.Item style={{
                                                    backgroundColor: "#3f8b96",
                                                    color: "white"
                                                }}>{r[i]}
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

export default ListPanel;