'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";


export default function Assets () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 ">
      <Tabs defaultValue="create" className="w-full">
      <TabsContent value="create">
      <Card>
        <CardHeader >
          <CardTitle>
            <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 z-20 justify-around shadow-md shadow-secondary px-0 sm:px-2">
              <p>Assets List - Testator address:</p>
              <Address address={connectedAddress} format="long" />
            </div>
          </CardTitle>  
          </CardHeader>
          <CardContent className="space-y-4">
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
                    <AddressInput onChange={setAddress} value={address} placeholder="Input your address" name="Token Address" />
                    <input type="text" placeholder="Token Name" className="w-32 p-2 border rounded" />
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
          </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
