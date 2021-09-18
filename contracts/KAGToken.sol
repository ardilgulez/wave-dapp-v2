// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KAGToken is ERC20, AccessControl {
    bytes32 constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(uint256 initialSupply) ERC20("KAG", "KAG Token") {
        _mint(msg.sender, initialSupply);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(MINTER_ROLE, msg.sender);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function mint(address account, uint256 amount)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(account, amount);
    }

    function makeMinter(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }
}
