'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card';
import { Clock, Users, FileText, AlertTriangle, Check } from 'lucide-react';
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";


export default function AlchemyTokenList () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [tokenBalances, setTokenBalances] = useState<any>(null);


  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };
  
  const alchemy = new Alchemy(settings);
  
  // The wallet address / token we want to query for:
 
  // Use useEffect to fetch token balances
  React.useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!connectedAddress) return;
      
      try {
        // Get all token balances
        const balances = await alchemy.core.getTokenBalances(connectedAddress);
    
        // Get metadata for all tokens with non-zero balance
        const nonZeroBalances = balances.tokenBalances.filter(
          token => token.tokenBalance !== "0"
        );

        const metadataPromises = nonZeroBalances.map(token => 
          alchemy.core.getTokenMetadata(token.contractAddress)
        );
        
        const metadataList = await Promise.all(metadataPromises);
        
        // Combine balances with metadata
        const tokensWithMetadata = nonZeroBalances.map((token, i) => ({
          balance: token.tokenBalance,
          metadata: metadataList[i],
          contractAddress: token.contractAddress
        }));
    
        setTokenBalances(tokensWithMetadata);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      }
    };

    fetchTokenBalances();
  }, [connectedAddress]); // Run when connectedAddress changes

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
              {/* Token Balances Display */}
              {tokenBalances && (
                <div className="border rounded p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>Token Name</span>
                    <span>Balance</span>
                    <span>Symbol</span>
                    <span>Address</span>
                  </div>
                  <div className="space-y-2">
                    {tokenBalances.map((token: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{token.metadata.name || 'Unknown'}</span>
                        <span>{parseInt(token.balance) / Math.pow(10, token.metadata.decimals)}</span>
                        <span>{token.metadata.symbol || '???'}</span>
                        <span className="text-sm">{token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Existing Asset Input Form */}
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
                    <AddressInput onChange={setAddress} value={address} placeholder="Input token address" name="Token Address" />
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
