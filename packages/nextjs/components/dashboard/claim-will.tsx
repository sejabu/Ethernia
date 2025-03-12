'use client';

import React, { useState } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';


export default function Claim () {
  const { address: connectedAddress } = useAccount();
  const [testatorAddress, setTestatorAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  const { data: userInfo, isLoading: isUserInfoLoading, refetch: refetchUserInfo } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "userInfo",    
    args: [testatorAddress || '0x0000000000000000000000000000000000000000'],
  });

  const enabled = Boolean(testatorAddress && testatorAddress.startsWith('0x'));
  
  const lastLifeProof = userInfo ? userInfo[1] : null;
  const lastlifeproof = lastLifeProof && Number(lastLifeProof) !== 0 ?new Date(Number(lastLifeProof) * 1000) : null;
  const formattedLastLifeProof = lastlifeproof ? lastlifeproof.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) : null;

  const handleTestatorAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !value.startsWith('0x')) {
      // Optionally prepend 0x
      setTestatorAddress('0x' + value);
    } else {
      setTestatorAddress(value);
    }
  };

  const handleAddressSubmit = async () => {
    if (!testatorAddress || !testatorAddress.startsWith('0x')) {
      alert('Please enter a valid Ethereum address');
      return;
  }

  // Refetch user info with the new address
  refetchUserInfo();
};

const handleClaimSubmit = async () => {
  if (!testatorAddress || !testatorAddress.startsWith('0x')) {
    alert('Please enter a valid Ethereum address');
    return;
  }

  if (!lastLifeProof) {
    alert('Cannot claim: No life proof record found');
    return;
  }

  try {
    setIsSubmitting(true);
    await writeEtherniaAsync({
      functionName: 'claimWill',
      args: [testatorAddress],
    });
    alert('Claim initiated successfully');
  } catch (error: any) {
    console.error('Error claiming will:', error);
    alert(`Failed to initiate claim: ${error?.message || 'Unknown error'}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-bold space-y-0 flex">
              Beneficiary address:&nbsp;&nbsp;
              <Address address={connectedAddress} format="long" />  
            </div>
      <div defaultValue="claim" className="w-full">
        <div className='card'>
          <h2 className='card-title'>Claim Will</h2>
          <div className="card-body space-y-4">
              <div className="p-4 shadow rounded bg-yellow-50">
                <div className="flex items-center space-x-2">
                  <LuTriangleAlert className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-600">Will can be claimed after proof of life expires</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Testator Address</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="0x..." 
                    className="w-full p-2 border rounded" 
                    value={testatorAddress}
                    onChange={handleTestatorAddressChange}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddressSubmit}
                  >
                    Check
                  </button>
                </div>
              </div>

              {isUserInfoLoading && (
                <div className="text-gray-500">Loading testator information...</div>
              )}

              {testatorAddress && userInfo && (
                <div className="p-4 shadow rounded bg-gray-50 space-y-2">
                  <h3 className="font-medium">Testator Information</h3>
                  <div>Last Proof of Life: {formattedLastLifeProof || 'None'}</div>
                </div>
              )}

              <button 
                className="w-full btn btn-warning"
                onClick={handleClaimSubmit}
                disabled={isSubmitting || !testatorAddress || !lastLifeProof}
              >
                {isSubmitting ? 'Processing...' : 'Initiate Claim'}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
