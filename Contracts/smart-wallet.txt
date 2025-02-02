// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DigitalWillSmartWallet is ReentrancyGuard {
    using ECDSA for bytes32;

    address public owner;
    address public willContract;
    
    struct TokenApproval {
        bool isApproved;
        uint256 amount;
        uint256 expiry;
    }
    
    // Token approvals for the will contract
    mapping(address => mapping(address => TokenApproval)) public tokenApprovals;
    
    // Recorded token balances for inheritance
    mapping(address => uint256) public declaredBalances;
    
    event TokensDeclared(address indexed token, uint256 amount);
    event ApprovalsUpdated(address indexed token, address indexed spender, uint256 amount);
    event TokensSwapped(address indexed fromToken, address indexed toToken, uint256 fromAmount, uint256 toAmount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyWillContract() {
        require(msg.sender == willContract, "Not will contract");
        _;
    }
    
    constructor(address _willContract) {
        owner = msg.sender;
        willContract = _willContract;
    }
    
    // Declare tokens for inheritance
    function declareTokensForWill(
        address[] calldata tokens,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(tokens.length == amounts.length, "Length mismatch");
        
        for(uint i = 0; i < tokens.length; i++) {
            declaredBalances[tokens[i]] = amounts[i];
            emit TokensDeclared(tokens[i], amounts[i]);
        }
    }
    
    // Approve transfers for when will executes
    function approveTransfer(
        address token,
        address beneficiary,
        uint256 amount
    ) external onlyWillContract {
        require(amount <= declaredBalances[token], "Exceeds declared balance");
        
        TokenApproval storage approval = tokenApprovals[token][beneficiary];
        approval.isApproved = true;
        approval.amount = amount;
        approval.expiry = block.timestamp + 7 days;
        
        IERC20(token).approve(beneficiary, amount);
        emit ApprovalsUpdated(token, beneficiary, amount);
    }
    
    // Revoke transfer approval
    function revokeTransfer(
        address token,
        address beneficiary
    ) external onlyWillContract {
        TokenApproval storage approval = tokenApprovals[token][beneficiary];
        approval.isApproved = false;
        approval.amount = 0;
        
        IERC20(token).approve(beneficiary, 0);
        emit ApprovalsUpdated(token, beneficiary, 0);
    }
    
    // Allow owner to swap tokens while alive
    function swapTokens(
        address router,
        address fromToken,
        address toToken,
        uint256 fromAmount,
        bytes calldata swapData
    ) external onlyOwner nonReentrant {
        // Approve router
        IERC20(fromToken).approve(router, fromAmount);
        
        // Get initial balance of target token
        uint256 initialToBalance = IERC20(toToken).balanceOf(address(this));
        
        // Execute swap
        (bool success, ) = router.call(swapData);
        require(success, "Swap failed");
        
        // Calculate received amount
        uint256 receivedAmount = IERC20(toToken).balanceOf(address(this)) - initialToBalance;
        
        // Update declared balances if tokens were declared
        if(declaredBalances[fromToken] > 0) {
            declaredBalances[fromToken] -= fromAmount;
            declaredBalances[toToken] += receivedAmount;
        }
        
        emit TokensSwapped(fromToken, toToken, fromAmount, receivedAmount);
    }
    
    // Execute transfer after will activation
    function executeTransfer(
        address token,
        uint256 amount
    ) external nonReentrant {
        TokenApproval storage approval = tokenApprovals[token][msg.sender];
        require(approval.isApproved, "Transfer not approved");
        require(block.timestamp <= approval.expiry, "Approval expired");
        require(amount <= approval.amount, "Exceeds approved amount");
        
        approval.amount -= amount;
        if(approval.amount == 0) {
            approval.isApproved = false;
        }
        
        IERC20(token).transfer(msg.sender, amount);
    }
    
    // Emergency functions
    function updateWillContract(address _newWillContract) external onlyOwner {
        willContract = _newWillContract;
    }
    
    // Recover stuck tokens
    function recoverTokens(
        address token,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
}
