'use client';

import React, { useState, useEffect } from 'react';
import { LuUsers, LuPercent, LuCircleDollarSign, LuWallet } from 'react-icons/lu';
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';
import { usePublicClient } from 'wagmi';
import { BlockieAvatar, Address } from "~~/components/scaffold-eth";

// Add this ERC20 ABI using parseAbi from viem
const erc20Abi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);

// Predefined tokens list
const AVAILABLE_TOKENS = [
  { address: "0x982edaE13f4ED35D7249E4C3a061343D2FAF6f8A", name: "FakeUSDT" },
  { address: "0xA70c701a78157C61b0c9e3671473Fe751C2A104d", name: "FakeUSDC" },
];

export default function ModifyWill () {
  
  const { address: connectedAddress } = useAccount();
  const [tokensList, setTokensList] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  
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
  
  const [isApproving, setIsApproving] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  
  const [isApproved, setIsApproved] = useState(false); // Flag to enable "Add Asset" button
  const [isAddingAsset, setIsAddingAsset] = useState(false); // Control add asset button
  const [addAssetError, setAddAssetError] = useState<string | null>(null); // Error in add asset
  
  const { writeContract, data: approveHash } = useWriteContract();
  const publicClient = usePublicClient();  
  const [beneficiaryList, setBeneficiaryList] = useState<BeneficiaryData[]>([]); 

  const { data: listBeneficiaries } = useScaffoldReadContract({
      contractName: "Ethernia",
      functionName: "listBeneficiaries",    
      args: [connectedAddress],
    });

  interface BeneficiaryData {
    beneficiary: string;
    percentage: bigint;
    index: number;
  }

  // Update beneficiary list when data changes
  useEffect(() => {
    if (listBeneficiaries && listBeneficiaries.length > 0) {
      const beneficiariesData: BeneficiaryData[] = listBeneficiaries.map((beneficiary, index) => ({
        beneficiary: beneficiary.beneficiary,
        percentage: beneficiary.percentage,
        index
      }));
      
      setBeneficiaryList(beneficiariesData);
    }
  }, [listBeneficiaries]);
   
  // Handle token selection change
  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value);
    // Reset approval states when changing token
    setIsApproved(false);
    setApprovalError(null);
  };
  
  // Get selected token details
  const getSelectedTokenDetails = () => {
    const token = AVAILABLE_TOKENS.find(t => t.address === selectedToken);
    return token || { address: "", name: "" };
  };
  
  // Add this approval function
  const approveToken = async (tokenAddress: string) => {
    try {
      if (!publicClient) throw new Error("Public client not available");
      if (!tokenAddress) throw new Error("No token selected");
      
      setIsApproving(true);
      setApprovalError(null);
  
      writeContract({
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
  
  const addAssetToWill = async () => {
    try {
      const { address: tokenAddress, name: tokenName } = getSelectedTokenDetails();
      
      if (!tokenAddress || !tokenName) {
        throw new Error("Please select a valid token");
      }
      
      setIsAddingAsset(true);
      setAddAssetError(null);
  
      await writeEtherniaAsync({
        functionName: "addERC20Assets",
        args: [tokenAddress, tokenName],
      });
  
      // Reset states
      setIsApproved(false);
      setSelectedToken("");
      console.log("Asset added to will!");
    } catch (error) {
      console.error("Error adding asset:", error);
      setAddAssetError(error instanceof Error ? error.message : "Failed to add asset");
    } finally {
      setIsAddingAsset(false);
    }
  };

  return (
    <div className='flex flex-col justify-center mt-2 w-3/4 mx-auto'>
      <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
          <h2 className='card-title justify-center'>Add/Remove Heirs</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Add Beneficiary Wallet Address:</label>
                <div className="flex items-center space-x-2">
                  <LuUsers className="h-5 w-5 text-gray-500" />
                  <input id="beneficiaryWallet" type="text" placeholder="Put beneficiary wallet address" className="w-full p-2 border rounded" /> 
                </div>
              </div>                
              <div className="space-y-2">
                <label className="block font-medium">Set Percentage (1-100):</label>
                <div className="flex items-center space-x-2">
                  <LuPercent className="h-5 w-5 text-gray-500" />
                  <input id="beneficiaryPercentage" type="number" placeholder="Put percentage to will" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
            <button
              className="w-full btn btn-primary"
              onClick={async () => {
                try {
                  const beneficiaryWalletInput = document.getElementById('beneficiaryWallet') as HTMLInputElement;
                  const beneficiaryWallet = String(beneficiaryWalletInput.value);
                  const beneficiaryPercentageInput = document.getElementById('beneficiaryPercentage') as HTMLInputElement;
                  const beneficiaryPercentage = BigInt(beneficiaryPercentageInput.value);
                  await writeEtherniaAsync({
                    functionName: "addBeneficiary",
                    args: [beneficiaryWallet, beneficiaryPercentage],
                  });
                }
                catch (e) {
                  console.error("Error adding beneficiary:", e);
                }
              }}>
              Add beneficiary to will.
            </button>
            <div className='card-body'>
              <h2 className='card-title'>Current Beneficiaries</h2>         
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox hidden" />
                        </label>
                      </th>
                      <th>Name</th>
                      <th>Wallet Address</th>
                      <th>Percentage</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaryList.length > 0 ? (
                      beneficiaryList.map((token, i) => (
                        <tr key={i}>
                          <th>
                            <label>
                              <input type="checkbox" className="checkbox" />
                            </label>
                          </th>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle h-12 w-12">
                                  <BlockieAvatar address={token.beneficiary} size={24}/>
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">N°&nbsp;{i + 1}</div>
                                {/* <div className="text-sm opacity-50">Name (if asigned)</div> */}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Address address={token.beneficiary} format="long" onlyEnsOrAddress={true} ></Address>
                          </td>
                          <td>
                            <span className='font-bold'>{token.percentage.toString()}%</span>&nbsp;Assigned.
                          </td>
                          <th>
                            <button className="btn btn-ghost btn-xs">Edit</button>
                          </th>
                        </tr>  
                      ))
                    ) : (
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src="/emptyperson.jpg"
                                  alt="Person Avatar" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Empty</div>
                              <div className="text-sm opacity-50">Empty</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          No beneficiaries added yet.
                        </td>
                        <td>0.00</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">Edit</button>
                        </th>
                      </tr>
                    )}
                  </tbody>
                  {/* foot */}
                  <tfoot>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>  
            </div>
          </div>
        </div>
      </div>
      <div className='card card-bordered bg-base-300 mb-6'>
        <div className="card-body">
        <h2 className='card-title justify-center'>Add/Remove Assets</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium">Select Token:</label>
              <div className="text-sm opacity-50">(This list will show your assets with balance &gt; 0)</div>
              <div className="flex items-center space-x-2">
                <LuWallet className="h-5 w-5 text-gray-500" />
                <select 
                  className="w-full p-2 border rounded"
                  value={selectedToken}
                  onChange={handleTokenChange}
                >
                  <option value="">-- Select a token --</option>
                  {AVAILABLE_TOKENS.map((token, index) => (
                    <option key={index} value={token.address}>
                      {token.name} ({token.address})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Display Selected Token Details */}
            {selectedToken && (
              <div className="p-3 bg-base-200 rounded">
                <h4 className="font-medium">Selected Token Details:</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="font-medium">Name:</span> {getSelectedTokenDetails().name}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {getSelectedTokenDetails().address}
                  </div>
                </div>
              </div>
            )}
            
            {/* APPROVE BUTTON */}
            <button
              className={`w-full btn btn-primary ${isApproving ? 'loading' : ''}`}
              disabled={isApproving || isApproved || !selectedToken} // Disable if no token selected, already approving or approved
              onClick={() => approveToken(selectedToken)}
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
              disabled={!isApproved || isAddingAsset || !selectedToken} // Only active if approved and not adding
              onClick={addAssetToWill}
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
          <div className='card-body'>
            <h2 className='card-title'>Assets List</h2>         
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    {/* <th>
                      <label>
                        <input type="checkbox" className="checkbox hidden" />
                      </label>
                    </th> */}
                    <th>Name</th>
                    <th>SC Address</th>
                    <th>Balance</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tokensList.length > 0 ? (
                    tokensList.map((token, i) => (
                      <tr key={i}>
                        {/* <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th> */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src="/usdt.jpg"
                                  alt="Token Logo" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{token.tokenName}</div>
                              <div className="text-sm opacity-50">Tether (USDT)</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Token {i + 1}: {token.tokenAddress}
                          <br />
                          {/* <span className="badge badge-ghost badge-sm"></span> */}
                        </td>
                        <td>{token.tokenBalance}</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">Remove</button>
                        </th>
                      </tr>  
                    ))
                    ) : (
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src="/empty.jpg"
                                  alt="Token Logo" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Empty</div>
                              <div className="text-sm opacity-50">Empty</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          No ERC20 tokens added yet.
                        </td>
                        <td>0.00</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">Remove</button>
                        </th>
                      </tr>
                    )
                  }
                </tbody>
                {/* foot */}
                <tfoot>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
}