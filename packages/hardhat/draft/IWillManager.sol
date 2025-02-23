// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IWillManager {
    function createWill(uint256 _renewPeriod, address[] memory _beneficiaries, uint256[] memory _percentages, address[] memory _assetAddress, string[] memory _tokenName) external payable;
    function renewLifeProof() external;
    function modifyWill(uint256 _renewPeriod, address[] memory _beneficiaries, uint256[] memory _percentages, address[] memory _assetAddress, string[] memory _tokenName) external;
    function deactivateWill() external;
    function claimWill(address _testatorAddress) external;
    function executeWill(address _testatorAddress) external;
}