'use client';

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { LuClock, LuBan, LuCheck, LuHeartPulse } from 'react-icons/lu';
import { BsChatSquareHeart } from "react-icons/bs";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { BlockieAvatar, Address } from "~~/components/scaffold-eth";

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
      <div className="w-full max-w-6xl mx-auto"> 
        <div className='card card-bordered bg-base-300 w-auto mb-6'>
          <div className='card-body'>
            <h2 className='card-title'>Will Status</h2>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Will Status</div>
                <div className="flex flex-grow flex-row stat-value">
                {isActive ? <LuCheck className="h-10 w-10 text-green-500" /> : <LuBan className="h-10 w-10 text-red-500"/>}
                {isActive ? <span className="text-2xl">Active&nbsp;</span>: <span className="text-2xl text-red-600">Inactive&nbsp;</span>}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Last proof of life</div>
                <div className="flex flex-grow flex-row stat-value">
                {formattedRenewDate ? <LuHeartPulse className="h-10 w-10 text-green-500" /> : <LuHeartPulse className="h-10 w-10 text-red-500"/>}
                {formattedRenewDate ? <span className="text-2xl">&nbsp;{formattedLastLifeProof}</span> : <span className="text-2xl text-red-500">&nbsp;Proof of life not found.</span>}
              </div>
              </div>

              <div className="stat">
                <div className="stat-title">Next renewal</div>
                <div className="flex flex-grow flex-row stat-value">
                {formattedRenewDate ? <LuClock className="h-10 w-10 text-green-500" /> : <LuClock className="h-10 w-10 text-red-500"/>}
                {formattedRenewDate ? <span className="text-2xl">&nbsp;{formattedRenewDate}</span> : <span className="text-2xl text-red-500">&nbsp;No renewal date set yet.</span>}
                </div>
              </div>
    
              <div className="stat">
                <div className="stat-title"></div>  
                <div className='btn p-2'>
                  <BsChatSquareHeart className="h-10 w-10  text-red-500" onClick={async () => {
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
          </div>
        </div>

        <div className='card card-bordered bg-base-300 w-auto mb-6'> 
          <div className='card-body'>
            <h2 className='card-title'>Assets List</h2>         
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    {/* <th>
                      <label>
                        <input type="checkbox" className="checkbox hidden" />
                      </label>
                    </th> */}
                    <th>Name</th>
                    <th>SC Address</th>
                    <th>Balance</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tokensList.length > 0 ? (
                    tokensList.map((token, i) => (
                      <tr key={i}>
                        {/* <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th> */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src="/usdt.jpg"
                                  alt="Token Logo" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{token.tokenName}</div>
                              <div className="text-sm opacity-50">Tether (USDT)</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Token {i + 1}: {token.tokenAddress}
                          <br />
                          {/* <span className="badge badge-ghost badge-sm"></span> */}
                        </td>
                        <td>{token.tokenBalance}</td>
                        <th>
                          <Link href="/dashboard/modify" >
                          <button className="btn btn-ghost btn-xs">Edit</button>
                          </Link>
                        </th>
                      </tr>  
                    ))
                    ) : (
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src="/empty.jpg"
                                  alt="Token Logo" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Empty</div>
                              <div className="text-sm opacity-50">Empty</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          No ERC20 tokens added yet.
                        </td>
                        <td>0.00</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">Remove</button>
                        </th>
                      </tr>
                    )
                  }
                </tbody>
                {/* foot */}
                <tfoot>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>  
          </div>
        </div>  

        <div className='card card-bordered bg-base-300 w-auto mb-6'> 
          <div className='card-body'>
            <h2 className='card-title'>Current Beneficiaries</h2>         
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    {/* <th>
                      <label>
                        <input type="checkbox" className="checkbox hidden" />
                      </label>
                    </th> */}
                    <th>Name</th>
                    <th>Wallet Address</th>
                    <th>Percentage</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaryList.length > 0 ? (
                    beneficiaryList.map((token, i) => (
                      <tr key={i}>
                        {/* <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th> */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                              <BlockieAvatar address={token.beneficiary} size={24}/>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">N°&nbsp;{i + 1}</div>
                              <div className="text-sm opacity-50">Name (if asigned)</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Address address={token.beneficiary} format="long" onlyEnsOrAddress={true} ></Address>
                        </td>
                        <td>
                          <span className='font-bold'>{token.percentage.toString()}%</span>&nbsp;Assigned.
                        </td>
                        <th>
                          <Link href="/dashboard/modify">
                          <button className="btn btn-ghost btn-xs">Edit</button>
                          </Link>
                        </th>
                      </tr>  
                    ))
                    ) : (
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src="/emptyperson.jpg"
                                  alt="Person Avatar" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Empty</div>
                              <div className="text-sm opacity-50">Empty</div>
                            </div>
                          </div>
                        </td>
                        <td>
                        No beneficiaries added yet.
                        </td>
                        <td>0.00</td>
                        <th>
                          <Link href="/dashboard/modify">
                           <button className="btn btn-ghost btn-xs">Edit</button>
                          </Link>
                        </th>
                      </tr>
                    )
                  }
                </tbody>
                {/* foot */}
                <tfoot>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>  
          </div>
        </div> 
      </div>
    </div>
  );
}
