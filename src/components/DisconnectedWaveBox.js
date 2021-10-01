import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./DisconnectedWaveBox.css";

const DisconnectedWaveBox = () => {
    return (
        <Container>
            <Row className="disconnected-wavebox">
                <h1 className="disconnected-wavebox-header">
                    Connect with Metamask
                </h1>
                <h3 className="disconnected-wavebox-header">
                    Say "Hi" to me after doing so!
                </h3>
            </Row>
        </Container>
    );
};

export default DisconnectedWaveBox;
