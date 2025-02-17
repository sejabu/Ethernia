'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function LifeProof() {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

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
                    <p className="text-sm text-gray-600">2024-02-10</p>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded">
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
