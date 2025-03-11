'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check, CircleDollarSign, Wallet } from 'lucide-react';
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';


export default function Assets () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [tokensList, setTokensList] = useState<TokenData[]>([]);

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  const { data: listERC20Tokens } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listERC20Tokens",    
    args: [connectedAddress],
  });
    
  interface TokenData {
  tokenAddress: string;
  tokenName: string;
  tokenBalance: bigint;
  index: number;
}

  // Update tokens list when data changes

  useEffect(() => {
    if (listERC20Tokens && listERC20Tokens.length > 0) {
      const tokensData: TokenData[] = listERC20Tokens.map((token, index) => ({
        tokenAddress: token.tokenAddress,
        tokenName: token.tokenName,
        tokenBalance: token.tokenBalance,
        index
      }));
      
      setTokensList(tokensData);
    }
  }, [listERC20Tokens]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 ">
      <Tabs defaultValue="create" className="w-full">
      <TabsContent value="create">
      <Card>
        <CardHeader >
          <CardTitle>
            <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 z-20 justify-around shadow px-0 sm:px-2">
              <p>Assets List - Testator address:</p>
              <Address address={connectedAddress} format="long" />
            </div>
          </CardTitle>  
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium">Digital Assets</label>
              {/* Token Balances Display */}
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Token smart contract address:</label>
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-gray-500" />
                  <input id="tokenAddress" type="text" placeholder="Put token address" className="w-full p-2 border rounded" />
                  
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="block font-medium">Token Name</label>
                <div className="flex items-center space-x-2">
                  <CircleDollarSign className="h-5 w-5 text-gray-500" />
                  <input id="tokenName" type="text" placeholder="USDT for example" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
            <button
              className="w-full btn btn-primary"
              onClick={async () => {
                try {
                  const tokenAddressInput = document.getElementById('tokenAddress') as HTMLInputElement;
                  const tokenAddress = String(tokenAddressInput.value);
                  const tokenNameInput = document.getElementById('tokenName') as HTMLInputElement;
                  const tokenName = String(tokenNameInput.value);
                  await writeEtherniaAsync({
                    functionName: "addERC20Assets",
                    args: [tokenAddress, tokenName],
                  });
                }
                catch (e) {
                  console.error("Error adding asset to will:", e);
                }
              }}>
              Add asset to will.
            </button>            
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Asset Distribution</h3>
              <div className="space-y-2">
              {tokensList.length > 0 ? (
                    tokensList.map((token, i) => (
                      <div key={i} className="p-3 shadow rounded">
                        <div className="flex justify-between">
                          <span>Token {i + 1}: {token.tokenAddress}</span>
                          <span>{token.tokenName}</span>
                          <span>{token.tokenBalance}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 shadow rounded text-center text-gray-500">
                      No ERC20 tokens added yet
                    </div>
                  )}
                </div>
            </div>         
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  );
}
