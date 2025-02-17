'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Mail, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function UserAccount () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Testator Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block font-medium">Add/Change Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <input type="text" placeholder="example@mail.com" className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-medium">Add/Change Name</label>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <input type="text" placeholder="Input your name" className="w-full p-2 border rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
