import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./WaveBox.css";

const WaveBox = () => {
    return (
        <Container className="wave-box-container">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Send me a Message!</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Add some ether to it! Don't worry, it's not real
                                money
                            </Form.Label>
                            <Row>
                                <Col md={6}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Amount"
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Select aria-label="Default select example">
                                        <option value="ether">Ether</option>
                                        <option value="gwei">Gwei</option>
                                        <option value="wei">Wei</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col md={{ span: 4, offset: 4 }}>
                                    <Button
                                        variant="light"
                                        // style={{ width: "100%" }}
                                        className="send-button"
                                    >
                                        Send
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default WaveBox;
