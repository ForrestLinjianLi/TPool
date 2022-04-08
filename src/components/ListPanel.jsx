import React, {Component} from 'react';
import {Button, Col, Container, ListGroup, Row} from "react-bootstrap";



class ListPanel extends Component {
    static defaultProps = {
        col:1,
        colNames: ["col1", "col2"],
        title: "title"
    }

    constructor(props) {
        super(props);
        this.getLists = this.getLists.bind(this);
    }

    getLists() {

    }

    render() {
        return (
            <Container style={{backgroundColor: "grey"}}>
                <Button disabled class="primary">{this.props.title}</Button>
                <Row>
                    {this.props.colNames.map(cn => {
                        return (
                            <Col>
                                <ListGroup>
                                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            )
                    })}
                </Row>
            </Container>
        );
    }
}

export default ListPanel;