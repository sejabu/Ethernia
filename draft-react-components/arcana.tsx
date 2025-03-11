'use client';
// template.tsx
import { Sidebar } from '~~/components/arcana-ca/sidebar';
import { Transfer} from '~~/components/arcana-ca/transfer';
import { PreLogin } from '~~/components/arcana-ca/preLogin';
import { BalanceSidebar } from '~~/components/arcana-ca/balanceSidebar';
import { getCA } from "~~/utils/getCA"
import React, { useState, useEffect } from 'react';

type Tab = 'transfer' | 'bridge' | 'refund';

const Arcana: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('transfer');
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const onSidebarClick = (tab: Tab) => {
    console.log("got click?");
    setCurrentTab(tab);
  };

  const connect = async () => {
    setConnected(true);
  };

  const disconnect = async () => {
    localStorage.removeItem("xar-casdk-last-connected-wallet");
    const ca = await getCA();
    await ca.request({
      method: "wallet_revokePermissions",
      params: [{
        eth_accounts: {}
      }]
    });
    setConnected(false);
  };

  useEffect(() => {
    // Perform any necessary setup on mount
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {connected ? (
        <div className="flex">
          <Sidebar onSidebarClick={onSidebarClick} disconnect={disconnect} />
          <div className="basis-4/6 mx-auto p-6">
            <div className="py-6">
              <h3 className="text-center mb-10 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white">
                Assets list across chains
              </h3>
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>
            <Transfer currentTab={currentTab} />
          </div>
          <BalanceSidebar />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col justify-center align-center">
          <PreLogin connect={connect} />
        </div>
      )}
    </div>
  );
};

export default Arcana;

// import React,{ useState, useEffect } from 'react';
// import { useAccount } from 'wagmi';
// import { useConnectModal } from '@rainbow-me/rainbowkit';
// import { CA } from '@arcana/ca-sdk';
// import { formatEther, parseEther } from 'viem';
// import { mainnet, polygon, arbitrum, optimism } from 'viem/chains';


// export default function Template(): JSX.Element {

//     interface ChainBalance {
//         chainName: string;
//         chainId: number;
//         balance: string;
//          formatted: string;
//     symbol: string;
//     }


//   const [isLoading, setIsLoading] = useState(false);
//   const [chainBalances, setChainBalances] = useState<ChainBalance[]>([]);
//   const [totalBalance, setTotalBalance] = useState('0');
//   const [caInstance, setCaInstance] = useState<CA | null>(null);
  
//   const { address, isConnected, connector } = useAccount();
//   const { openConnectModal } = useConnectModal();
  
//   // Define chains to check balances on
//   const supportedChains = [
//     { id: mainnet.id, name: 'Ethereum', symbol: 'ETH' },
//     { id: polygon.id, name: 'Polygon', symbol: 'MATIC' },
//     { id: arbitrum.id, name: 'Arbitrum', symbol: 'ETH' },
//     { id: optimism.id, name: 'Optimism', symbol: 'ETH' }
//   ];
  
//   // Initialize Arcana CA
//   React.useEffect(() => {
//     const initCA = async () => {
//         try {
//           // Get the provider from the connector
//           const provider = window.ethereum;
          
//           // Initialize CA SDK
//           const ca = new CA();
//           ca.setEVMProvider(provider);
//           await ca.init();
          
//           // Setup hooks for allowance and intent (optional - can be customized)
//           ca.setOnAllowanceHook(async ({ allow, deny, sources }) => {
//             // Simple implementation - allow minimum allowance
//             const minAllowances = sources.map(() => 'min');
//             allow(minAllowances);
//           });
          
//           ca.setOnIntentHook(({ intent, allow, deny, refresh }) => {
//             // Simple implementation - auto allow intent
//             allow();
//           });
          
//           // Add event listeners (optional)
//           ca.caEvents.on("expected_steps", (data) => {
//             console.log("Expected steps:", data);
//           });
          
//           ca.caEvents.on("step_complete", (data) => {
//             console.log("Step completed:", data);
//           });
          
//           setCaInstance(ca);
//         } catch (error) {
//           console.error("Failed to initialize Arcana CA:", error);
//         }
      
//     };
    
//     initCA();
    
//     // Cleanup
//     return () => {
//       if (caInstance) {
//         caInstance.caEvents.removeAllListeners();
//       }
//     };
//   }, [isConnected, connector]);
  
//   // Fetch unified balances using CA SDK
//   const fetchUnifiedBalances = async () => {
//     if (!caInstance || !address) return;
    
//     setIsLoading(true);
    
//     try {
//       // Get all unified balances
//       const unifiedBalances = await caInstance.getUnifiedBalances();
//       console.log("Unified balances:", unifiedBalances);

//     } catch (error) {
//         console.error(`Error processing balance:`, error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="text-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">Unified Wallet Balance</h2>
//         {address && (
//           <p className="text-sm text-gray-500 truncate">
//             {address}
//           </p>
//         )}
//       </div>
      
//       {!isConnected ? (
//         <div className="text-center">
//           <button
//             onClick={openConnectModal}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Connect Wallet
//           </button>
//         </div>
//       ) : (
//         <div>
//           {isLoading ? (
//             <div className="text-center py-4">
//               <p>Loading unified balances...</p>
//             </div>
//           ) : (
//             <>
//               <div className="bg-gray-100 p-4 rounded-lg mb-4">
//                 <p className="text-lg font-semibold">Total Balance</p>
//                 <p className="text-2xl font-bold">{totalBalance} ETH</p>
//               </div>
              
//               <div className="space-y-2">
//                 <p className="font-medium">Balance by Chain</p>
//                 {chainBalances.map((item) => (
//                   <div 
//                     key={item.chainId} 
//                     className="flex justify-between items-center p-2 border-b"
//                   >
//                     <span>{item.chainName}</span>
//                     <span>{item.formatted} {item.symbol}</span>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mt-4">
//                 <button
//                   onClick={fetchUnifiedBalances}
//                   className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                 >
//                   Refresh Balances
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

