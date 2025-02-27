'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Ban, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';


export default function Status () {
  
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();
  const [beneficiaryList, setBeneficiaryList] = useState<BeneficiaryData[]>([]);
  const [tokensList, setTokensList] = useState<TokenData[]>([]);

  interface BeneficiaryData {
    beneficiary: string;
    percentage: bigint;
    index: number;
  }
  
  interface TokenData {
    tokenAddress: string;
    tokenName: string;
    tokenBalance: bigint;
    index: number;
  }

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

  const { data: listBeneficiaries } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listBeneficiaries",    
    args: [connectedAddress],
  });
  
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
                      {isClaimed ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <Ban className="h-5 w-5 text-green-500"/>}
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
                {tokensList.length > 0 ? (
                    tokensList.map((token, i) => (
                      <div key={i} className="p-3 border rounded">
                        <div className="flex justify-between">
                          <span>Token {i + 1}: {token.tokenAddress}</span>
                          <span>{token.tokenName}</span>
                          <span>{token.tokenBalance}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 border rounded text-center text-gray-500">
                      No ERC20 tokens added yet
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Current Beneficiaries</h3>
                <div className="space-y-2">
                {beneficiaryList.length > 0 ? (
                    beneficiaryList.map((token, i) => (
                      <div key={i} className="p-3 border rounded">
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
