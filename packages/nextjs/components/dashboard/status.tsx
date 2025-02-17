'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function Status () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();


  return (
    <div className="w-full max-w-6xl mx-auto p-0 space-y-0">
      <p className="text-center text-bold space-y-0">
        Testator address: 
        <Address address={connectedAddress} />  
      </p>
      

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
                    <Check className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Will Status</p>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Next Renewal</p>
                      <p className="text-sm text-blue-600">30 days</p>
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
                        <span>Token {i}</span>
                        <span>100 USDC</span>
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
                        <p className="text-sm text-gray-600">0x1234...5678</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>25%</span>
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
