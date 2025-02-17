'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function Successors () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Successors List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                              <label className="block font-medium">Add Beneficiaries</label>
                              <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-gray-500" />
                                <input type="text" placeholder="Wallet Address" className="w-full p-2 border rounded" />
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
