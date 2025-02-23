// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./WillStorage.sol";

contract AssetManager is WillStorage {
    using SafeERC20 for IERC20;

    function executeAssetTransfer(address _testator) internal {
        Will storage will = getWill(_testator);
        
        for (uint256 i = 0; i < will.assetList.length; i++) {
            address asset = will.assetList[i];
            if (IERC20(asset).totalSupply() > 0) {
                uint256 balance = IERC20(asset).balanceOf(_testator);
                for (uint256 j = 0; j < will.beneficiaryList.length; j++) {
                    address beneficiary = will.beneficiaryList[j];
                    uint256 amount = (balance * will.beneficiaries[beneficiary]) / 100;
                    IERC20(asset).safeTransferFrom(_testator, beneficiary, amount);
                }
            }
        }
    }
}