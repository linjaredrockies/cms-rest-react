// src/components/bootstrap-carousel.component.js
import React, { Component } from "react";

import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MDBInput } from 'mdb-react-ui-kit';

class MyModalComponent extends Component {

    onTrigger = (event) => {
        this.props.onSubmit(this.refs);
        event.preventDefault();
    }

    render() {
    
        return (
            <div>
                <Modal show={this.props.show} onHide={(e) => this.props.onHide(e)}>

                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.body}

                        {this.props.data.map(item => (
                            <p key={item}>
                                <input type="text" placeholder={item} ref={item} className="field" />
                            </p>
                        ))}

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e) => this.props.onClose(e)} >Close</Button>
                        <Button variant="primary" onClick={(e) => this.onTrigger(e)}  >Submit</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        )
    };
}

export default MyModalComponent;