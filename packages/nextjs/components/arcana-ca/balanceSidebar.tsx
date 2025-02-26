"use client";

import { useEffect, useState } from 'react';
import { getCA } from "~~/utils/getCA";
import { CA } from '@arcana/ca-sdk';
import Decimal from "decimal.js";
import { ChevronDown as ChevronDownIcon } from 'lucide-react';

type BalancesType = Awaited<ReturnType<CA["getUnifiedBalances"]>>;

const BalanceSidebar: React.FC = () => {
  const [balances, setBalances] = useState<BalancesType>([]);
  const [address, setAddress] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleAccordion = (value: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const setBalancePolling = (ca: CA) => {
    setInterval(async () => {
      const updatedBalances = await ca.getUnifiedBalances();
      setBalances(updatedBalances);
    }, 20000);
  };

  useEffect(() => {
    const initializeCA = async () => {
      const ca = await getCA();
      const accounts = (await ca.request({ method: "eth_accounts" }) as string[]);
      console.log({ accounts });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }

      const initialBalances = await ca.getUnifiedBalances();
      setBalances(initialBalances);
      console.log({ balances: initialBalances });
      
      setBalancePolling(ca);
    };

    initializeCA();
    
    // No cleanup function for the interval as it should continue running
  }, []);

  return (
    <aside id="logo-sidebar" className="basis-1/6 min-h-screen" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <p className="text-center p-4 mb-4 font-bold leading-none tracking-tight text-gray-900 border-2 border-gray-200 rounded-lg dark:text-white">
          {address}
        </p>
        <h5 id="drawer-navigation-label" className="mb-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
          Balances
        </h5>
        
        {balances.length > 0 && (
          <div className="flex px-3 flex-col overflow-y-auto field divide-y divide-gray-200 dark:divide-gray-700">
            {balances.map((balance) => {
              const itemKey = JSON.stringify(balance.breakdown);
              const isExpanded = expandedItems.has(itemKey);
              
              return (
                <div key={itemKey} className="py-3">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {balance.symbol}

                      <button 
                        onClick={() => toggleAccordion(itemKey)}
                        className="flex items-center gap-1"
                      >
                        <span className="text-[12px] text-gray-500">
                          {balance.breakdown.length} chain{balance.breakdown.length > 1 ? "s" : ""}
                        </span>
                        <div className="transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <ChevronDownIcon className="h-3 w-3 text-gray-500" />
                        </div>
                      </button>
                    </div>
                    <div className="text-gray-900 dark:text-white text-base font-semibold">
                      {new Decimal(balance.balance).toDecimalPlaces(4).toNumber()} {balance.symbol}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="pt-2">
                      <div className="p-3 bg-gray-200 font-xs rounded-lg space-y-4 dark:bg-gray-900">
                        {balance.breakdown.map((token, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="text-xs text-gray-900 dark:text-white">
                              {`${balance.symbol} (${token.chain.name})`}
                            </div>
                            <div className="text-xs text-gray-900 dark:text-white">
                              {`${new Decimal(token.balance).toDecimalPlaces(4).toNumber()} ${balance.symbol}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export {BalanceSidebar};