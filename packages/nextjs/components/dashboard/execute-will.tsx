'use client';

import React, { useState } from 'react';
import { LuTriangleAlert, LuCheck, LuBan } from 'react-icons/lu';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';


export default function Execute () {
  const { address: connectedAddress } = useAccount();
  const [testatorAddress, setTestatorAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  const { data: willData } = useScaffoldReadContract({
      contractName: "Ethernia",
      functionName: "willData",    
      args: [testatorAddress],
    });
  
  const claimTime = willData ? willData[3] : null; // 4th element is the isActive boolean
  const claimtime = claimTime && Number(claimTime) !== 0 ?new Date(Number(claimTime) * 1000) : null;
  const formattedClaimTime = claimtime ? claimtime.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) : null;

  const { data: claimPeriod } = useScaffoldReadContract({
      contractName: "Ethernia",
      functionName: "claimPeriod",    
  });

  const executionPeriod = Number(claimPeriod) + Number(claimTime);
  const executionperiod = executionPeriod &&  executionPeriod !== 0 ?new Date(executionPeriod * 1000) : null;
  const formattedExecutionPeriod = executionperiod ? executionperiod.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) : null;  
  
  const isActive = willData ? willData[5] : false; // 6th element is the isActive boolean
  const isClaimed = willData ? willData[6] : false; // 7th element is the isClaimed boolean
  const isExecuted = willData ? willData[7] : false; // 8th element is the isExecuted boolean


  const { data: userInfo, isLoading: isUserInfoLoading, refetch: refetchUserInfo } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "userInfo",    
    args: [testatorAddress || '0x0000000000000000000000000000000000000000'],
  });

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

  const enabled = Boolean(testatorAddress && testatorAddress.startsWith('0x'));
  

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

const handleExecuteSubmit = async () => {
  if (!testatorAddress || !testatorAddress.startsWith('0x')) {
    alert('Please enter a valid Ethereum address');
    return;
  }

  if (!claimTime) {
    alert('Cannot execute: No claim record found');
    return;
  }

  try {
    setIsSubmitting(true);
    await writeEtherniaAsync({
      functionName: 'executeWill',
      args: [testatorAddress],
    });
    alert('Execute initiated successfully');
  } catch (error: any) {
    console.error('Error executing will:', error);
    alert(`Failed to execute will: ${error?.message || 'Unknown error'}`);
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
      <div defaultValue="executeWill" className="w-full">
        <div className='card'>
          <div className="card-body grid grid-cols-2 gap-4">
                <div className="p-4 shadow rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Will Status</p>
                      <div className="flex items-center">
                      {isActive ? <LuCheck className="h-5 w-5 text-green-500" /> : <LuBan className="h-5 w-5 text-red-500"/>}
                      {isActive ? <span className="text-sm text-green-600">&nbsp;Active</span>: <span className="text-sm text-red-600">&nbsp;Inactive</span>}
                    </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 shadow rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Is Claimed?</p>
                      <div className="flex items-center">
                      {isClaimed ? <LuTriangleAlert className="h-5 w-5 text-red-500" /> : <LuBan className="h-5 w-5 text-green-500"/>}
                      {isClaimed ? <span className="text-sm text-red-600">&nbsp;Claimed</span> : <span className="text-sm text-green-600">&nbsp;Not Claimed</span >}
                      {formattedClaimTime ? <span className="text-sm text-red-600">&nbsp;{formattedClaimTime}</span> : <span className="text-sm text-green-600">&nbsp;Not claimed yet.</span>}

                      </div>
                    </div>
                  </div>
                </div>
                </div>
            <h2 className='card-title'>Execute Will</h2>
            
            <div className="card-body space-y-4">
              <div className="p-4 shadow bg-yellow-50">
                <div className="flex items-center space-x-2">
                  <LuTriangleAlert className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-600">Will can be executed after be claimed and expired execution period of time ({formattedExecutionPeriod}).</p>
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
                  <div>Last Life Proof: {formattedLastLifeProof || 'None'}</div>
                </div>
              )}

              <button 
                className="w-full btn btn-warning"
                onClick={handleExecuteSubmit}
                disabled={isSubmitting || !testatorAddress || !claimTime}
              >
                {isSubmitting ? 'Processing...' : 'Execute Will'}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
