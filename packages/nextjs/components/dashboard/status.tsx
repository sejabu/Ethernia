'use client';

import React, { useState, useEffect } from 'react';
import { LuClock, LuBan, LuTriangleAlert, LuCheck, LuHeartPulse } from 'react-icons/lu';
import { BsChatSquareHeart } from "react-icons/bs";
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';


export default function Status () {

  const { address: connectedAddress } = useAccount();
  const [beneficiaryList, setBeneficiaryList] = useState<BeneficiaryData[]>([]);
  const [tokensList, setTokensList] = useState<TokenData[]>([]);

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  interface BeneficiaryData {
    beneficiary: string;
    percentage: bigint;
    index: number;
  }
  
  interface TokenData {
    tokenAddress: string;
    tokenName: string;
    tokenBalance: bigint;
    index: number;
  }

  const { data: willData } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "willData",    
    args: [connectedAddress],
  });

  const isActive = willData ? willData[5] : false; // Assuming the 6th element is the isActive boolean
  const isClaimed = willData ? willData[6] : false; // Assuming the 7th element is the isClaimes boolean

  
  const { data: userInfo } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "userInfo",    
    args: [connectedAddress],
  });

  //

  const lastLifeProof = userInfo ? userInfo[1] : null;
  const lastlifeproof = lastLifeProof && Number(lastLifeProof) !== 0 ?new Date(Number(lastLifeProof) * 1000) : null;
  const formattedLastLifeProof = lastlifeproof ? lastlifeproof.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit"
  }) : null;

  const renewPeriod = willData ? willData[2] : null; // Assuming the 6th element is the isActive boolean
  const renewDate = renewPeriod&& Number(renewPeriod) !== 0 && lastLifeProof && Number(lastLifeProof) !== 0 ? new Date(Number(renewPeriod+lastLifeProof) * 1000) : null;
  const formattedRenewDate = renewDate ? renewDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit"
  }) : null;


  const { data: claimPeriod } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "claimPeriod",    
  });



  const date = new Date(Number(claimPeriod) * 1000);
  const dateInMinutes = Number(date) / 60000;
  const formattedDate = date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });


  
  const { data: listERC20Tokens } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listERC20Tokens",    
    args: [connectedAddress],
  });
  
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

  const { data: listBeneficiaries } = useScaffoldReadContract({
    contractName: "Ethernia",
    functionName: "listBeneficiaries",    
    args: [connectedAddress],
  });
  
  useEffect(() => {
    if (listBeneficiaries && listBeneficiaries.length > 0) {
      const beneficiariesData: BeneficiaryData[] = listBeneficiaries.map((beneficiary, index) => ({
        beneficiary: beneficiary.beneficiary,     // Changed from beneficiaryAddress
        percentage: beneficiary.percentage,       // Changed from beneficiaryPercentage
        index
      }));
      
      setBeneficiaryList(beneficiariesData);
    }
  }, [listBeneficiaries]);


  return (
    <div className='flex flex-col justify-center space-x-4'>
      <div className="w-full max-w-6xl mx-auto p-0 space-y-0"> 
        <div className='card card-border'>
          <div className='card-body'>
            <h3 className='card-title'>Will Status</h3>
          </div>

    <div className="stats shadow">
      <div className="stat">
        <div className="stat-figure text-secondary">
        </div>
        <div className="stat-title">Will Status</div>
        <div className="flex flex-grow flex-row stat-value">
        {isActive ? <span className="text-2xl text-green-600">Active&nbsp;</span>: <span className="text-2xl text-red-600">Inactive&nbsp;</span>}
        {isActive ? <LuCheck className="h-10 w-10 text-green-500" /> : <LuBan className="h-10 w-10 text-red-500"/>}
        </div>
        <div className="stat-desc">
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
        </div>
        <div className="stat-title">Last proof of life</div>
        <div className="flex flex-grow flex-row stat-value">
        {formattedRenewDate ? <LuHeartPulse className="h-10 w-10 text-green-500" /> : <LuHeartPulse className="h-10 w-10 text-red-500"/>}
        {formattedRenewDate ? <span className="text-2xl text-green-500">&nbsp;{formattedLastLifeProof}</span> : <span className="text-2xl text-red-500">&nbsp;Proof of life not found.</span>}
        </div>
        <div className="stat-desc">
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
        </div>
        <div className="stat-title">Next renewal</div>
        <div className="flex flex-grow flex-row stat-value">
        {formattedRenewDate ? <LuClock className="h-10 w-10 text-green-500" /> : <LuClock className="h-10 w-10 text-red-500"/>}
        {formattedRenewDate ? <span className="text-2xl text-green-500">&nbsp;{formattedRenewDate}</span> : <span className="text-2xl text-red-500">&nbsp;No renewal date set yet.</span>}
        </div>
        <div className="stat-desc">
        </div>
      </div>
    
      <div className="stat">
        <div className="stat-figure text-secondary">
        </div>
        <div className="stat-title"></div>  
        <div className='btn p-2'>
          <BsChatSquareHeart className="h-10 w-10" onClick={async () => {
            try {
              await writeEtherniaAsync({
              functionName: "renewLifeProof",
              });
              } catch (error) {
              console.error("Error renewing life proof:", error);
              }
            }}
          />
        </div>
      </div>
    </div>
    

            <div className="space-y-4">
              {/* <div className="grid grid-cols-2 gap-4">
               
                <div className="p-4 shadow rounded">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">Is Claimed?</p>
                      <div className="flex items-center">
                      {isClaimed ? <LuTriangleAlert className="h-5 w-5 text-red-500" /> : <LuBan className="h-5 w-5 text-green-500"/>}
                      {isClaimed ? <span className="text-sm text-red-600">&nbsp;Claimed</span> : <span className="text-sm text-green-600">&nbsp;Not Claimed</span >}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div> */}

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
              <div className="space-y-2">
                <h3 className="font-medium">Current Beneficiaries</h3>
                <div className="space-y-2">
                {beneficiaryList.length > 0 ? (
                    beneficiaryList.map((token, i) => (
                      <div key={i} className="p-3 shadow rounded">
                        <div className="flex justify-between">
                          <span>Beneficiary {i + 1}:&nbsp;{token.beneficiary}</span>
                          <span>Percentage assigned:&nbsp;{token.percentage.toString()}&nbsp;%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 shadow rounded text-center text-gray-500">
                      No beneficiaries added yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
   
    </div>
  );
}
