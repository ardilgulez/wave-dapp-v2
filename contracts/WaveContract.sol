//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WaveContract {
    struct Wave {
        address from;
        string message;
        uint256 amount;
        uint256 timestamp;
    }

    Wave[] waves;
    event NewWave(
        address indexed _from,
        string _message,
        uint256 _amount,
        uint256 _timestamp
    );

    uint256 waveCount;
    mapping(address => uint256) walletToWaveCount;
    mapping(address => uint256) walletToAmount;

    constructor() {
        console.log("Deploying a Greeter with greeting:");
    }
}
