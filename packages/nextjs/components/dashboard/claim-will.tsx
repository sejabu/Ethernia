'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function Claim () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();


  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="claim" className="w-full">
        <TabsContent value="claim">
          <Card>
            <CardHeader>
              <CardTitle>Claim Will</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded bg-yellow-50">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-600">Will can be claimed after proof of life expires</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Testator Address</label>
                <input type="text" placeholder="0x..." className="w-full p-2 border rounded" />
              </div>

              <button className="w-full bg-yellow-600 text-white p-3 rounded hover:bg-yellow-700">
                Initiate Claim
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
