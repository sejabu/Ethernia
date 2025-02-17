'use client';

import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";


export default function DeleteWill () {
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
                      <div>
                        <p className="font-medium">Deactive Will?</p>
                        <div className="flex space-x-2 h-8 items-center justify-center text-sm">
                          <XMarkIcon className="swap-on h-5 w-5" />
                          <CheckIcon className="swap-off h-5 w-5" /> 
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
