'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function CreateWill() {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 ">
      <Tabs defaultValue="create" className="w-full">
      <TabsContent value="create">
      <Card>
        <CardHeader >
          <CardTitle>
            <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 z-20 justify-around shadow-md shadow-secondary px-0 sm:px-2">
              <p>Create Digital Will - Testator address:</p>
              <Address address={connectedAddress} />
            </div>
          </CardTitle>  
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Renewal Period</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <input type="number" placeholder="Days" className="w-full p-2 border rounded" />
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="block font-medium">Add Beneficiaries</label>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <input type="text" placeholder="Wallet Address" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Digital Assets</label>
              <div className="border rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span>Asset Type</span>
                  <span>Contract Address</span>
                  <span>Token Name</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <select className="p-2 border rounded">
                      <option>ERC20</option>
                      <option>ERC721</option>
                      <option>ERC1155</option>
                    </select>
                    <input type="text" placeholder="0x..." className="flex-1 p-2 border rounded" />
                    <input type="text" placeholder="Token Name" className="w-32 p-2 border rounded" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
              Create Will
            </button>
          </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
