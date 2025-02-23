// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FakeTetherB is ERC20, Ownable, ERC20Permit {
    constructor()
        ERC20("FakeTetherB", "FTB")
        Ownable(msg.sender)
        ERC20Permit("FakeTetherB")
    {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}