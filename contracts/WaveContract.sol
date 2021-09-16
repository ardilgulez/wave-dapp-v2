//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./KAGToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WaveContract is Ownable {
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

    KAGToken kagToken;
    address _tokenAddress;

    uint256 private waveCount;
    mapping(address => uint256) private walletToWaveCount;
    mapping(address => uint256) private walletToAmount;

    constructor(address tokenAddress) Ownable() {
        console.log("Token address: %s", tokenAddress);
        _tokenAddress = tokenAddress;
        kagToken = KAGToken(tokenAddress);
    }

    function wave(string calldata _message) external payable {
        waves.push(
            Wave({
                from: msg.sender,
                message: _message,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );
        walletToWaveCount[msg.sender] += 1;
        walletToAmount[msg.sender] += msg.value;
        waveCount += 1;
        if (msg.value > 0) {
            kagToken.transfer(msg.sender, 1);
        }
        emit NewWave(msg.sender, _message, msg.value, block.timestamp);
    }

    function waveCountOf(address account) external view returns (uint256) {
        return walletToWaveCount[account];
    }

    function amountWavedBy(address account) external view returns (uint256) {
        return walletToAmount[account];
    }

    function totalWaveCount() external view returns (uint256) {
        return waveCount;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
