'use client';

import React, { useState } from 'react';
import { LuClock } from 'react-icons/lu';
import { BsChatSquareHeart } from "react-icons/bs";
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
    <div className="w-auto max-w-6xl mx-auto p-6 space-y-6">
        <div className='card card-bordered bg-base-300 w-auto mb-6'>
          <div className='card-body'>
            <h2 className='card-title'>Check and Set your Proof of Life</h2>
              <div className="flex items-center justify-between p-4 shadow border rounded-md bg-base-100">
                <div className="flex items-center space-x-2 rounded-md">
                  <LuClock className="h-10 w-10 text-green-500" />
                  <div>
                    <p className="font-medium">Last Proof of Life</p>
                    <p className="text-sm text-gray-600">{formattedLastLifeProof ? formattedLastLifeProof : "No life proof"}</p>
                  </div>
                </div>

                <div className='flex text-center btn p-2'>
                  <span>Renew Proof of Life</span>
                  <BsChatSquareHeart className="h-10 w-10" onClick={async () => {
                    try {
                      await writeEtherniaAsync({
                        functionName: "renewLifeProof",
                      });
                    } catch (error) {
                      console.error("Error renewing life proof:", error);
                    }
                  }}
                  />
                </div>
              </div>
          </div>
        </div>
    </div>
  );
}
