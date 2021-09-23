import React from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./Stats.css";

const Stats = ({ totalWaveCount }) => {
    return (
        <div className="stats">
            <Container>
                <Row>
                    <Col lg={4} className="stats-column">
                        <h2 className="stats-title">Total Waves:</h2>
                        <p className="wave-count">{totalWaveCount}</p>
                    </Col>
                    <Col lg={4} className="stats-column">
                        <h2 className="stats-title">Biggest Waver:</h2>
                        <p className="stats-item">5 ethers</p>
                        <p className="stats-item">
                            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
                        </p>
                    </Col>
                    <Col lg={4} className="stats-column">
                        <h2 className="stats-title">Loudest Wavers:</h2>
                        <p className="stats-item">5 times</p>
                        <p className="stats-item">
                            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 : 3 times
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Stats;
