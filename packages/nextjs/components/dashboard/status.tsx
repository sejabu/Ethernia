'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Ban, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';


export default function Status () {
  
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

  const { data: willData } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "willData",    
    args: [connectedAddress],
  });

  const isActive = willData ? willData[5] : false; // Assuming the 6th element is the isActive boolean
  const isClaimed = willData ? willData[6] : false; // Assuming the 7th element is the isClaimes boolean

  
  const { data: userInfo } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "userInfo",    
    args: [connectedAddress],
  });

  //

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

  const renewPeriod = willData ? willData[2] : null; // Assuming the 6th element is the isActive boolean
  const renewDate = renewPeriod&& Number(renewPeriod) !== 0 && lastLifeProof && Number(lastLifeProof) !== 0 ? new Date(Number(renewPeriod+lastLifeProof) * 1000) : null;
  const formattedRenewDate = renewDate ? renewDate.toLocaleDateString("es-ES", {
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



  const date = new Date(Number(claimPeriod) * 1000);
  const dateInMinutes = Number(date) / 60000;
  const formattedDate = date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });


  
  const { data: listERC20Tokens } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listERC20Tokens",    
    args: [connectedAddress],
  });
  
  const erc20TokenAddress = listERC20Tokens && listERC20Tokens.length > 0 ? listERC20Tokens[0].tokenAddress : null; 
  const erc20TokenName = listERC20Tokens && listERC20Tokens.length > 0 ? listERC20Tokens[0].tokenName : null; 

  const { data: ERC20Balance } = useScaffoldReadContract({
    contractName: "FakeTetherA",
    functionName: "balanceOf",    
    args: [connectedAddress],
  });

  const { data: listBeneficiaries } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listBeneficiaries",    
    args: [connectedAddress],
  });
  
  const beneficiaryAddress = listBeneficiaries && listBeneficiaries.length > 0 ? listBeneficiaries[0].beneficiary : null;
  const beneficiaryPercentage = listBeneficiaries && listBeneficiaries.length > 0 ? listBeneficiaries[0].percentage : null; 


  return (
    <div className="w-full max-w-6xl mx-auto p-0 space-y-0">
      <div className="text-bold space-y-0 flex">
        Testator address:&nbsp;&nbsp;
        <Address address={connectedAddress} format="long" />  
      </div>
      

      <Tabs defaultValue="status" className="w-full">
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Will Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Will Status</p>
                      <div className="flex items-center">
                      {isActive ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-red-500"/>}
                      {isActive ? <span className="text-sm text-green-600">&nbsp;Active</span>: <span className="text-sm text-red-600">&nbsp;Inactive</span>}
                    </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Is Claimed?</p>
                      <div className="flex items-center">
                      {isClaimed ? <Check className="h-5 w-5 text-red-500" /> : <Ban className="h-5 w-5 text-green-500"/>}
                      {isClaimed ? <span className="text-sm text-red-600">&nbsp;Claimed</span> : <span className="text-sm text-green-600">&nbsp;Not Claimed</span >}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Last life proof</p>
                      <div className="flex items-center">
                      {formattedLastLifeProof ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-red-500"/>}
                      {formattedLastLifeProof ? <span className="text-sm text-green-600">&nbsp;{formattedLastLifeProof}</span> : <span className="text-sm text-red-600">&nbsp;No life proof</span>}
                    </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Next Renewal</p>
                      <div className="flex items-center">
                      {formattedRenewDate ? <Clock className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-red-500"/>}
                      {formattedRenewDate ? <span className="text-sm text-blue-600">&nbsp;{formattedRenewDate}</span> : <span className="text-sm text-red-600">&nbsp;No renewal date set yet.</span>}
                    </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Asset Distribution</h3>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 border rounded">
                      <div className="flex justify-between">
                        <span>Token {i} {erc20TokenAddress}</span>
                        <span>{erc20TokenName}</span>
                        <span>{ERC20Balance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Current Beneficiaries</h3>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Beneficiary {i}</p>
                        <p className="text-sm text-gray-600">{beneficiaryAddress}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>{beneficiaryPercentage}%</span>
                        <button className="text-red-600">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
