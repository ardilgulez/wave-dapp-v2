import React from "react";
import Wave from "./Wave";
import Container from "react-bootstrap/Container";

import "./WaveList.css";

const WaveList = ({ waves }) => {
    return (
        <Container className="wave-list-container">
            {waves &&
                waves.map((wave, index) => <Wave wave={wave} key={index} />)}
        </Container>
    );
};

export default WaveList;
