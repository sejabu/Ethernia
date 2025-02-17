import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/app/v2/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/app/v2/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';

export default function willDashboard() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Ethernia Digital Will</h1>
        <p className="text-gray-600">Secure your digital legacy on the blockchain</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="create">Create Will</TabsTrigger>
          <TabsTrigger value="manage">Manage Will</TabsTrigger>
          <TabsTrigger value="claim">Claim Will</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Digital Will</CardTitle>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
