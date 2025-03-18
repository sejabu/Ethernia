# Ethernia Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Contract Architecture](#contract-architecture)
4. [Data Structures](#data-structures)
5. [Features](#features)
6. [User Guide](#user-guide)
7. [Developer Guide](#developer-guide)
8. [Security Considerations](#security-considerations)
9. [Future Roadmap](#future-roadmap)
10. [FAQ](#faq)

## Introduction

Ethernia is a decentralized digital will management system built on the Scroll blockchain. It enables users to create, manage, and execute digital wills, allowing secure inheritance of crypto assets without the need for traditional intermediaries.

The project aims to solve the problem of crypto asset inheritance, providing a transparent, secure, and programmable approach to ensuring digital assets can be passed on to designated beneficiaries when needed.

## Overview

Ethernia enables users to create digital wills that specify how their ERC20 tokens should be distributed among beneficiaries. Key features include:

- **Life Proof System**: Testators must periodically confirm they are active, preventing premature execution of their will
- **Beneficiary Management**: Users can designate multiple beneficiaries with specific percentage allocations
- **Token Management**: Support for multiple ERC20 tokens
- **Claim & Execution Process**: Two-phase execution with built-in time delays for security
- **Fee Structure**: Small execution fee to maintain the system

## Contract Architecture

The Ethernia contract is designed with a modular architecture focusing on security, gas efficiency, and user experience. It extends OpenZeppelin's `ReentrancyGuard` and uses `SafeERC20` for secure token transfers.

### Key Dependencies
- **OpenZeppelin Contracts**: Provides security standards and utilities
  - `ReentrancyGuard`: Prevents re-entrancy attacks
  - `SafeERC20`: Ensures safe interactions with ERC20 tokens

### Contract Structure
```
Ethernia
├── Data Structures
│   ├── UserInfo
│   ├── Erc20Data
│   ├── Beneficiaries
│   └── WillData
├── Storage
│   ├── userInfo mapping
│   └── willData mapping
├── Configuration
│   ├── claimPeriod
│   ├── executionFee
│   └── owner
├── User Management Functions
│   ├── registerUser()
│   └── renewLifeProof()
├── Will Management Functions
│   ├── createWill()
│   └── deactivateWill()
├── Beneficiary Management Functions
│   ├── addBeneficiary()
│   ├── removeBeneficiary()
│   └── updateBeneficiaryPercentage()
├── Asset Management Functions
│   ├── addERC20Assets()
│   └── updateTokenBalances()
├── Execution Functions
│   ├── claimWill()
│   ├── executeWill()
│   └── erc20Transfer() [private]
├── View Functions
│   ├── listBeneficiaries()
│   ├── listERC20Tokens()
│   └── isWillClaimable()
└── Admin Functions
    ├── setClaimPeriod()
    ├── setExecutionFee()
    └── withdrawFees()
```

## Data Structures

### UserInfo
```solidity
struct UserInfo {
    address wallet;
    uint256 lastLifeProof;
    bool isTestator;
}
```
- `wallet`: User's Ethereum address
- `lastLifeProof`: Timestamp of the last life proof
- `isTestator`: Whether the user has created a will

### Erc20Data
```solidity
struct Erc20Data {
    address tokenAddress;
    string tokenName;
    uint256 tokenBalance;
}
```
- `tokenAddress`: Address of the ERC20 token contract
- `tokenName`: Human-readable name of the token
- `tokenBalance`: User's balance of the token

### Beneficiaries
```solidity
struct Beneficiaries {
    address beneficiary;
    uint256 percentage;
}
```
- `beneficiary`: Address of the beneficiary
- `percentage`: Percentage of assets allocated (1-100)

### WillData
```solidity
struct WillData {
    string name;
    uint256 creationTime;
    uint256 renewPeriod;
    uint256 claimTime;
    uint256 executionTime;
    bool isActive;
    bool isClaimed;
    bool isExecuted;
    address claimer;
    address executor;
    Beneficiaries[] beneficiaryList;
    Erc20Data[] erc20Tokens;
}
```
- `name`: Name of the will
- `creationTime`: Timestamp when the will was created
- `renewPeriod`: Time period after which life proof must be renewed
- `claimTime`: Timestamp when the will was claimed
- `executionTime`: Timestamp when the will was executed
- `isActive`: Whether the will is active
- `isClaimed`: Whether the will has been claimed
- `isExecuted`: Whether the will has been executed
- `claimer`: Address of the user who claimed the will
- `executor`: Address of the user who executed the will
- `beneficiaryList`: List of beneficiaries
- `erc20Tokens`: List of ERC20 tokens to be distributed

## Features

### User Registration and Management
- **Registration**: Users must register before creating a will
- **Life Proof**: Testators must periodically renew their life proof to keep the will inactive

### Will Creation and Management
- **Creation**: Users can create a will with a specified renewal period
- **Deactivation**: Testators can deactivate their will if no longer needed
- **Token Updates**: Token balances can be updated before execution

### Beneficiary Management
- **Adding**: Testators can add beneficiaries with percentage allocations
- **Removing**: Beneficiaries can be removed if needed
- **Updating**: Percentage allocations can be adjusted

### Asset Management
- **ERC20 Support**: Multiple ERC20 tokens can be added to a will
- **Balance Tracking**: Token balances are tracked and can be updated

### Will Execution
- **Two-Phase Process**: Claim phase followed by execution phase
- **Time Locks**: Built-in delays prevent immediate execution
- **Fee Structure**: Small execution fee supports system maintenance

## User Guide

### Getting Started

#### 1. Registration
To use Ethernia, you first need to register as a user:
```javascript
// Using web3.js
const etherniaContract = new web3.eth.Contract(ETHERNIA_ABI, ETHERNIA_ADDRESS);
await etherniaContract.methods.registerUser().send({ from: userAddress });
```

#### 2. Creating a Will
After registration, create your will:
```javascript
// Name of your will
const willName = "My Crypto Will";
// Renewal period in time units (days in production, minutes in testing)
const renewPeriod = 30; // 30 days

await etherniaContract.methods.createWill(willName, renewPeriod).send({ from: userAddress });
```

#### 3. Adding Beneficiaries
Add beneficiaries who will receive your assets:
```javascript
const beneficiaryAddress = "0x..."; // Ethereum address of beneficiary
const percentage = 50; // 50% of assets

await etherniaContract.methods.addBeneficiary(beneficiaryAddress, percentage).send({ from: userAddress });
```

#### 4. Adding ERC20 Assets
Add ERC20 tokens you want to include in your will:
```javascript
// First approve the Ethernia contract to transfer your tokens
const tokenContract = new web3.eth.Contract(ERC20_ABI, TOKEN_ADDRESS);
await tokenContract.methods.approve(ETHERNIA_ADDRESS, MAX_UINT256).send({ from: userAddress });

// Then add the token to your will
const tokenName = "Example Token";
await etherniaContract.methods.addERC20Assets(TOKEN_ADDRESS, tokenName).send({ from: userAddress });
```

#### 5. Renewing Life Proof
Regularly renew your life proof to keep your will inactive:
```javascript
await etherniaContract.methods.renewLifeProof().send({ from: userAddress });
```

### For Beneficiaries

#### 1. Claiming a Will
If a testator's life proof has expired, a beneficiary can claim the will:
```javascript
await etherniaContract.methods.claimWill(testatorAddress).send({ from: beneficiaryAddress });
```

#### 2. Executing a Will
After the claim period, a beneficiary can execute the will:
```javascript
await etherniaContract.methods.executeWill(testatorAddress).send({ from: beneficiaryAddress });
```

## Developer Guide

### Contract Deployment

To deploy the Ethernia contract:

1. Install dependencies:
```bash
npm install @openzeppelin/contracts
```

2. Compile the contract:
```bash
npx hardhat compile
```

3. Deploy to the desired network:
```bash
npx hardhat run scripts/deploy.js --network scroll
```

### Integration Guide

#### Key Contract Events
Monitor these events for integration with your dApp:

```solidity
event UserRegistered(address indexed user, uint256 timestamp);
event TestatorCreated(address indexed testator, string name, uint256 renewPeriod);
event LifeProofRenewed(address indexed testator, uint256 timestamp);
event BeneficiaryAdded(address indexed testator, address indexed beneficiary, uint256 percentage);
event BeneficiaryRemoved(address indexed testator, address indexed beneficiary);
event ERC20AssetAdded(address indexed testator, address indexed tokenAddress, string tokenName);
event WillClaimed(address indexed testator, address indexed claimer, uint256 timestamp);
event WillExecuted(address indexed testator, address indexed executor, uint256 timestamp);
event WillDeactivated(address indexed testator, uint256 timestamp);
event TokenTransferred(address indexed from, address indexed to, address indexed tokenAddress, uint256 amount);
```

#### Example Integration Script
```javascript
// Listen for will execution events
etherniaContract.events.WillExecuted({})
  .on('data', (event) => {
    console.log(`Will executed: Testator ${event.returnValues.testator}, Executor: ${event.returnValues.executor}`);
    // Update UI, send notifications, etc.
  })
  .on('error', console.error);
```

## Security Considerations

### Security Features
1. **ReentrancyGuard**: Prevents re-entrancy attacks during execution
2. **SafeERC20**: Ensures safe token transfers with proper error handling
3. **Two-Phase Execution**: Claim and execution phases with time delays
4. **Percentage Validation**: Ensures percentage allocations do not exceed 100%
5. **Address Validation**: Prevents interactions with zero addresses

### Best Practices for Users
1. **Regular Life Proofs**: Testators should regularly renew their life proof
2. **Multiple Beneficiaries**: Consider adding multiple beneficiaries for redundancy
3. **Token Allowances**: Only approve the specific tokens you intend to include
4. **Testing**: Verify your will setup with small amounts before including significant assets

## Future Roadmap

### Planned Features
1. **Multi-Will Support**: Allow users to create multiple wills for different scenarios
2. **NFT Support**: Extend to support NFT assets
3. **Automatic Token Discovery**: Automatically detect and add user's tokens
4. **ZK Privacy Methods**: Enhance privacy with zero-knowledge proofs
5. **Arcana SDK Integration**: Additional security and recovery mechanisms

### Development Timeline
- **Q2 2025**: Enhanced token support and UI improvements
- **Q3 2025**: NFT integration and multi-will capability
- **Q4 2025**: Privacy features and automatic token discovery
- **Q1 2026**: Mobile app and expanded blockchain support

## FAQ

### General Questions

**Q: What is Ethernia?**  
A: Ethernia is a decentralized digital will system that enables users to specify how their crypto assets should be distributed to beneficiaries after a period of inactivity.

**Q: How does Ethernia know when to execute a will?**  
A: Ethernia uses a "life proof" system where users must periodically confirm they are active. If a user fails to provide proof of life within their specified renewal period, their will becomes claimable.

**Q: What tokens are supported?**  
A: Currently, Ethernia supports all standard ERC20 tokens on the Ethereum network.

### Technical Questions

**Q: How are funds transferred?**  
A: Funds remain in the testator's wallet until execution. During execution, the contract transfers tokens directly from the testator's wallet to the beneficiaries according to the specified percentages.

**Q: What happens if token approvals expire?**  
A: If token approvals expire or are revoked, the will execution will fail. It's recommended to set unlimited approvals for tokens included in your will.

**Q: Is there a limit to how many tokens I can include?**  
A: Currently, there is a limit of 20 ERC20 tokens per will to prevent gas-related issues.

### Security Questions

**Q: Can someone execute my will while I'm still active?**  
A: No, as long as you renew your life proof before the renewal period expires, your will cannot be claimed or executed.

**Q: What happens if a beneficiary's address is compromised?**  
A: If you suspect a beneficiary's address has been compromised, you can remove them from your will using the `removeBeneficiary` function and add their new address.

**Q: Is there a fee for using Ethernia?**  
A: We are studying the optimal commercial strategy for this platform. Currently, there is no fee for creating a will or adding beneficiaries. A small percentage fee (currently 2%) is applied during execution to maintain the system.
