//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./KAGToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WaveContract is Ownable {
    struct Wave {
        uint256 id;
        address from;
        string message;
        uint256 amount;
        uint256 timestamp;
    }

    Wave[] private waves;
    event NewWave(
        uint256 _id,
        address indexed _from,
        string _message,
        uint256 _amount,
        uint256 _timestamp
    );

    KAGToken private kagToken;
    address private _tokenAddress;

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
                id: waveCount,
                from: msg.sender,
                message: _message,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );
        walletToWaveCount[msg.sender] += 1;
        walletToAmount[msg.sender] += msg.value;
        if (msg.value > 0) {
            kagToken.transfer(msg.sender, 1);
        }

        if (kagToken.balanceOf(address(this)) < 1000) {
            kagToken.mint(address(this), 1000);
        }
        emit NewWave(
            waveCount,
            msg.sender,
            _message,
            msg.value,
            block.timestamp
        );
        waveCount += 1;
    }

    function getWaves() external view returns (Wave[] memory) {
        return waves;
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

    function kagTokenAddress() external view returns (address) {
        return _tokenAddress;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
