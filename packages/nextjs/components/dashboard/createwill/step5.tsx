'use client';

import React, { useState, useEffect } from 'react';
import { LuUsers, LuPercent } from 'react-icons/lu';
import { PiNumberCircleFive } from 'react-icons/pi';
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { BlockieAvatar, Address } from "~~/components/scaffold-eth";

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
