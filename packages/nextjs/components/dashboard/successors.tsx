'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check, ScrollText, Percent } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';



export default function Successors () {
  const [activeTab, setActiveTab] = useState('create');
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
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Successors List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Add Beneficiaries</label>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <input id="beneficiaryWallet" type="text" placeholder="Put beneficiary wallet address" className="w-full p-2 border rounded" />
                  
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="block font-medium">Percentage</label>
                <div className="flex items-center space-x-2">
                  <Percent className="h-5 w-5 text-gray-500" />
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
            </CardContent>
          </Card>
        </TabsContent>

        

        
      </Tabs>
    </div>
  );
}
