'use client';

import React, { useState, useEffect } from 'react';
import { LuCircleDollarSign, LuWallet } from 'react-icons/lu';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { useWriteContract, useTransaction } from 'wagmi';
import { parseAbi } from 'viem';

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
const ETHERNIA_CONTRACT_ADDRESS = '0x73f1c0D8533a554DEBBe39540645F12ec1F90465';

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
const [isApproving, setIsApproving] = useState(false);
const [approvalError, setApprovalError] = useState<string | null>(null);

// Add these Wagmi hooks
const { writeContract, data: approveHash } = useWriteContract();

// Add this hook to wait for the approval transaction
const { isLoading: isApprovalLoading, isSuccess: isApprovalSuccess } = 
  useTransaction({
    hash: approveHash,
  });

// Add this approval function
const approveToken = async (tokenAddress: string) => {
  try {
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

    return true;
  } catch (error) {
    console.error("Error approving token:", error);
    setApprovalError("Failed to approve token");
    return false;
    } finally {
    setIsApproving(false);
    }
  };


  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 ">
      <div defaultValue="create" className="w-full">
      <div className='card'>
      <div className="flex space-y-4 justify-between">
        <p>For this demo purpose, you will need first mint some fantasy tokens:&nbsp;</p>
        <span className="btn btn-primary btn-xs" onClick={async () => {
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
        <span className="btn btn-primary btn-xs">Mint FakeUSDT-B</span>
      </div>
        <div className="card-title sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 z-20 justify-around shadow px-0 sm:px-2">
              <p>Assets List - Testator address:</p>
              <Address address={connectedAddress} format="long" />
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
            <button
              className={`w-full btn btn-primary ${isApproving || isApprovalLoading ? 'loading' : ''}`}
              disabled={isApproving || isApprovalLoading}
              onClick={async () => {
                try {
                  const tokenAddressInput = document.getElementById('tokenAddress') as HTMLInputElement;
                  const tokenAddress = String(tokenAddressInput.value);
                  const tokenNameInput = document.getElementById('tokenName') as HTMLInputElement;
                  const tokenName = String(tokenNameInput.value);
            
                  // First approve the token
                  const isApproved = await approveToken(tokenAddress);
                  
                  if (isApproved && isApprovalSuccess) {
                    // Then add the asset to the will
                    await writeEtherniaAsync({
                      functionName: "addERC20Assets",
                      args: [tokenAddress, tokenName],
                    });
                    
                    // Clear inputs after successful addition
                    tokenAddressInput.value = '';
                    tokenNameInput.value = '';
                  }
                } catch (e) {
                  console.error("Error adding asset to will:", e);
                }
              }}>
              {isApproving || isApprovalLoading ? 'Approving...' : 'Add asset to will'}
            </button>
            {/* Add error message display */}
            {approvalError && (
            <div className="text-red-500 text-sm mt-2">
            {approvalError}
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
    </div>
  </div>
  );
}
