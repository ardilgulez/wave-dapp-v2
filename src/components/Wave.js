import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./Wave.css";

const parseDate = (timestamp) => {
    console.log(timestamp);
    const date = new Date(timestamp * 1000);
    const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    const month =
        date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
    const minutes =
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    const seconds =
        date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
    return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
};

const Wave = ({ wave }) => {
    return (
        <Row className="wave-row">
            <Col lg={{ span: 6, offset: 3 }}>
                <Card>
                    <Card.Title>
                        <div className="title-wrapper">
                            <span className="wave-from">{wave.from}</span>
                            <span className="wave-timestamp">
                                {parseDate(wave.timestamp)}
                            </span>
                        </div>
                    </Card.Title>
                    <Card.Body>
                        <Card.Text>{wave.message}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Wave;
