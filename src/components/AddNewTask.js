import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

class AddNewTask extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
    }

    render() {
      return <div id="add-task-panel">
      <Button variant="primary">Primary</Button>{' '}
      </div>;
    }
  }

  export default AddNewTask;