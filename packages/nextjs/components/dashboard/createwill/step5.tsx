'use client';

import React, { useState, useEffect } from 'react';
import { LuUsers, LuPercent } from 'react-icons/lu';
import { PiNumberCircleFive } from 'react-icons/pi';
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';

export default function Beneficiaries () {
  const { address: connectedAddress } = useAccount();
  const [beneficiaryList, setBeneficiaryList] = useState<BeneficiaryData[]>([]);
  

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
      contractName: "Ethernia",
     });

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
        beneficiary: beneficiary.beneficiary,     // Changed from beneficiaryAddress
        percentage: beneficiary.percentage,       // Changed from beneficiaryPercentage
        index
      }));
      
      setBeneficiaryList(beneficiariesData);
    }
  }, [listBeneficiaries]);



  return (
    <div className='flex flex-col justify-center space-x-4 mt-2 w-3/4 mx-auto'>
          <div className='card card-bordered bg-base-300 mb-6'>
            <div className='card-body'>
              <h3 className='card-title justify-center'><PiNumberCircleFive />&nbsp;Add the Beneficiaries</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Add Beneficiaries</label>
                <div className="flex items-center space-x-2">
                  <LuUsers className="h-5 w-5 text-gray-500" />
                  <input id="beneficiaryWallet" type="text" placeholder="Put beneficiary wallet address" className="w-full p-2 border rounded" />
                  
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="block font-medium">Percentage</label>
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
              <div className="space-y-2">
                <h3 className="font-medium">Current Beneficiaries</h3>
                <div className="space-y-2">
                {beneficiaryList.length > 0 ? (
                    beneficiaryList.map((token, i) => (
                      <div key={i} className="p-3 shadow rounded">
                        <div className="flex justify-between">
                          <span>Beneficiary {i + 1}:&nbsp;{token.beneficiary}</span>
                          <span>Percentage assigned:&nbsp;{token.percentage.toString()}&nbsp;%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 border rounded text-center text-gray-500">
                      No beneficiaries added yet.
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
        <li className="step step-primary">Add beneficiaries</li>
        <li className="step">Finish</li>
      </ul>
    </div>
  );
}
