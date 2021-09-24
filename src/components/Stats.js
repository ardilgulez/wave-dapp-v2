import React from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./Stats.css";

const Stats = ({
    totalWaveCount,
    highestContributor,
    highestContribution,
    loudestContributor,
    loudestContribution,
}) => {
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
                        <p className="stats-item">{`${highestContribution} ethers`}</p>
                        <p className="stats-item">{highestContributor}</p>
                    </Col>
                    <Col lg={4} className="stats-column">
                        <h2 className="stats-title">Loudest Wavers:</h2>
                        <p className="stats-item">
                            {loudestContribution} times
                        </p>
                        <p className="stats-item">{loudestContributor}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Stats;
