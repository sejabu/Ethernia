'use client';

import React, { useState, useEffect } from 'react';
import { LuCircleDollarSign, LuWallet } from 'react-icons/lu';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { useWriteContract, useTransaction } from 'wagmi';
import { parseAbi } from 'viem';
import { PiNumberCircleFour } from 'react-icons/pi';
import { usePublicClient } from 'wagmi';


// Add this ERC20 ABI using parseAbi from viem
const erc20Abi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);


export default function Assets () {

  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [tokensList, setTokensList] = useState<TokenData[]>([]);

  const { writeContractAsync: writeFakeTetherAAsync } = useScaffoldWriteContract({ contractName: "FakeTetherA" });
  const { writeContractAsync: writeFakeTetherBAsync } = useScaffoldWriteContract({ contractName: "FakeTetherB" });

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  const { data: listERC20Tokens } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listERC20Tokens",    
    args: [connectedAddress],
  });
    
  interface TokenData {
  tokenAddress: string;
  tokenName: string;
  tokenBalance: bigint;
  index: number;
}

// Add the correct hardcoded contract address
const ETHERNIA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ETHERNIA_CONTRACT_ADDRESS;

  // Update tokens list when data changes

  useEffect(() => {
    if (listERC20Tokens && listERC20Tokens.length > 0) {
      const tokensData: TokenData[] = listERC20Tokens.map((token, index) => ({
        tokenAddress: token.tokenAddress,
        tokenName: token.tokenName,
        tokenBalance: token.tokenBalance,
        index
      }));
      
      setTokensList(tokensData);
    }
  }, [listERC20Tokens]);

  // Inside your Assets component, add these new states and hooks
const [isApproving, setIsApproving] = useState(false); // Control approve button
const [approvalError, setApprovalError] = useState<string | null>(null); // To show errors

const [isApproved, setIsApproved] = useState(false); // Flag to enable "Add Asset" button
const [isAddingAsset, setIsAddingAsset] = useState(false); // Control add asset button
const [addAssetError, setAddAssetError] = useState<string | null>(null); // Error in add asset

// Add these Wagmi hooks
const { writeContract, data: approveHash } = useWriteContract();

// Add this hook to wait for the approval transaction
const { isLoading: isApprovalLoading, isSuccess: isApprovalSuccess } = 
  useTransaction({
    hash: approveHash,
  });

const publicClient = usePublicClient();


// Add this approval function
const approveToken = async (tokenAddress: string) => {
  try {
    if (!publicClient) throw new Error("Public client not available");
    setIsApproving(true);
    setApprovalError(null);

    await writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        ETHERNIA_CONTRACT_ADDRESS as `0x${string}`, 
        BigInt(2) ** BigInt(256) - BigInt(1) // Max uint256 value
      ],
    });

    // Enable "Add Asset" button
    setIsApproved(true);

    return true;
  } catch (error) {
    console.error("Error approving token:", error);
    setApprovalError("Failed to approve token");
    setIsApproved(false);
    return false;
    } finally {
    setIsApproving(false);
    
    }
  };

  const addAssetToWill = async (tokenAddress: string, tokenName: string) => {
    try {
      setIsAddingAsset(true);
      setAddAssetError(null);
  
      await writeEtherniaAsync({
        functionName: "addERC20Assets",
        args: [tokenAddress, tokenName],
      });
  
      // Optional: Reset states
      setIsApproved(false); // If you want to require re-approval for next asset
      console.log("Asset added to will!");
    } catch (error) {
      console.error("Error adding asset:", error);
      setAddAssetError(error instanceof Error ? error.message : "Failed to add asset");
    } finally {
      setIsAddingAsset(false);
    }
  };

  return (
    <div className='flex flex-col justify-center space-x-4 mt-2 w-3/4 mx-auto'>
      <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
          <h3 className='card-title justify-center'><PiNumberCircleFour />&nbsp;Add your Assets</h3>
          <div role="alert" className="alert alert-vertical sm:alert-horizontal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>For this demo purpose, you will need first mint some fantasy tokens:&nbsp;</span>
            <div>
            <span className="btn btn-primary btn-sm" onClick={async () => {
              try {
              const amount = BigInt(1000);
              await writeFakeTetherAAsync({
                functionName: "mint",
                args: [amount],
              });
              } catch (error) {
                console.error("Minting failed:", error);
              } 
              }}>
              Mint FakeUSDT-A
            </span>
            <span>&nbsp;</span>
            <span className="btn btn-primary btn-sm" onClick={async () => {
              try {
              const amount = BigInt(1000);
              await writeFakeTetherBAsync({
                functionName: "mint",
                args: [amount],
              });
              } catch (error) {
                console.error("Minting failed:", error);
              } 
              }}>
              Mint FakeUSDT-B
            </span>
            </div>
          </div>
          <span className="text-center">
            You can access the token address through the debug page:{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              <a href="/debug">ehernia.online/debug</a>
            </code>
          </span>
        </div>

        
        <div className="card-body space-y-4">
            <div className="space-y-2">
              <label className="block font-medium">Digital Assets</label>
              {/* Token Balances Display */}
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Token smart contract address:</label>
                <div className="flex items-center space-x-2">
                  <LuWallet className="h-5 w-5 text-gray-500" />
                  <input id="tokenAddress" type="text" placeholder="Put token address" className="w-full p-2 border rounded" />
                  
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="block font-medium">Token Name</label>
                <div className="flex items-center space-x-2">
                  <LuCircleDollarSign className="h-5 w-5 text-gray-500" />
                  <input id="tokenName" type="text" placeholder="USDT for example" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
            {/* APPROVE BUTTON */}
            <button
              className={`w-full btn btn-primary ${isApproving ? 'loading' : ''}`}
              disabled={isApproving || isApproved } // Disable if already approved
              onClick={async () => {
                const tokenAddressInput = document.getElementById('tokenAddress') as HTMLInputElement;
                const tokenAddress = String(tokenAddressInput.value);
                await approveToken(tokenAddress);
                }}
                >
                {isApproving ? 'Approving...' : (isApproved ? 'Approved!' : 'Approve token')}
            </button>

            {/* SHOW ERROR IF ANY */}
            {approvalError && (
              <div className="text-red-500 text-sm mt-2">
                {approvalError}
              </div>
            )}
            {/* ADD ASSET BUTTON */}
            <button
              className={`w-full btn btn-secondary ${isAddingAsset ? 'loading' : ''}`}
              disabled={!isApproved || isAddingAsset} // Only active if approved and not adding
              onClick={async () => {
                const tokenAddressInput = document.getElementById('tokenAddress') as HTMLInputElement;
                const tokenNameInput = document.getElementById('tokenName') as HTMLInputElement;
                const tokenAddress = String(tokenAddressInput.value);
                const tokenName = String(tokenNameInput.value);
            
                await addAssetToWill(tokenAddress, tokenName);

                  // Optional: Clear input fields after success
                  tokenAddressInput.value = '';
                  tokenNameInput.value = '';
                }}
              >
                {isAddingAsset ? 'Adding...' : 'Add asset to will'}
              </button>
              
              {/* SHOW ERROR IF ANY */}
              {addAssetError && (
                <div className="text-red-500 text-sm mt-2">
                  {addAssetError}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Asset Distribution</h3>
              <div className="space-y-2">
              {tokensList.length > 0 ? (
                    tokensList.map((token, i) => (
                      <div key={i} className="p-3 shadow rounded">
                        <div className="flex justify-between">
                          <span>Token {i + 1}: {token.tokenAddress}</span>
                          <span>{token.tokenName}</span>
                          <span>{token.tokenBalance}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 shadow rounded text-center text-gray-500">
                      No ERC20 tokens added yet
                    </div>
                  )}
                </div>
            </div>         
          </div>
        </div>
    
    <ul className="steps steps-horizontal">
      <li className="step step-primary">Connect</li>
      <li className="step step-primary">Register</li>
      <li className="step step-primary">Create Will</li>
      <li className="step step-primary">Add Assets</li>
      <li className="step">Add beneficiaries</li>
      <li className="step">Finish</li>
    </ul>
  </div>
  );
}
