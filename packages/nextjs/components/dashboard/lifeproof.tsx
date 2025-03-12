'use client';

import React, { useState } from 'react';
import { LuClock } from 'react-icons/lu';
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';

export default function LifeProof() {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
   });

  const { data: userInfo } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "userInfo",    
    args: [connectedAddress],
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



  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div defaultValue="manage" className="w-full">
        <div className='card card-border'>
            
            <div className='card-title'>Manage Your Will</div>
            
            <div className='car-body'>
              <div className="flex items-center justify-between p-4 shadow rounded">
                <div className="flex items-center space-x-2">
                  <LuClock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Last Proof of Life</p>
                    <p className="text-sm text-gray-600">{formattedLastLifeProof ? formattedLastLifeProof : "No life proof"}</p>
                  </div>
                </div>
                <div className="btn btn-primary btn-md"  onClick={async () => {
                  try {
                    await writeEtherniaAsync({
                      functionName: "renewLifeProof",
                    });
                  } catch (error) {
                    console.error("Error renewing life proof:", error);
                  }
                }}>
                  Renew Proof of Life
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
