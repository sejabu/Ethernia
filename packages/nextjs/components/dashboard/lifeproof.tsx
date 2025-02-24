'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';

export default function LifeProof() {
  const [activeTab, setActiveTab] = useState('create');
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
      <Tabs defaultValue="manage" className="w-full">
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Will</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Last Proof of Life</p>
                    <p className="text-sm text-gray-600">{formattedLastLifeProof ? formattedLastLifeProof : "No life proof"}</p>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={async () => {
                  try {
                    await writeEtherniaAsync({
                      functionName: "renewLifeProof",
                    });
                  } catch (error) {
                    console.error("Error renewing life proof:", error);
                  }
                }}>
                  Renew Life Proof
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        

        
      </Tabs>
    </div>
  );
}
