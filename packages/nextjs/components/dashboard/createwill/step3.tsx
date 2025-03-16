'use client';

import { LuClock, LuScrollText } from 'react-icons/lu';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { PiNumberCircleThree } from 'react-icons/pi';


export default function Create() {

  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  return (
    <div className='flex flex-col justify-center space-x-4 mt-2 w-1/2 mx-auto'>
      <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
          <h3 className='card-title justify-center'><PiNumberCircleThree />&nbsp;Create your Will</h3>
          <div className='flex flex-col space-x-0 space-y-4 justify-center lg:flex-row lg:space-x-4 lg:space-y-0 lg:align-items: stretch'>
            <div className="card bg-base-100 w-auto lg:w-96 shadow-sm flex: 1">
            <div className="flex flex-col items-center justify-center p-4">
              <form className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Will Name</label>
                  <div className="relative">
                    <input
                      id="willName"
                      type="text"
                      placeholder="Put a name to your will (can be anything)"
                      className="w-full px-10 py-2 border rounded-md"
                    />
                    <LuScrollText className="absolute top-2.5 left-3 text-gray-400" size={18}  />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Renewal Period</label>
                  <div className="relative">
                    <input
                      id="renewalPeriod"
                      type="number"
                      placeholder="Time in days (minutes for test)"
                      className="w-full px-10 py-2 border rounded-md"
                    />
                    <LuClock className="absolute top-2.5 left-3 text-gray-400" size={18} />
                  </div>
                </div>
                <button
                  className="w-full btn btn-primary"
                  onClick={async () => {
                  try {
                    const renewalPeriodInput = document.getElementById('renewalPeriod') as HTMLInputElement;
                    const renewalPeriod = BigInt(renewalPeriodInput.value);
                    const willNameInput = document.getElementById('willName') as HTMLInputElement;
                    const willName = willNameInput.value;
                    await writeEtherniaAsync({
                      functionName: "createWill",
                      args: [willName, renewalPeriod],
                    });
                  }
                  catch (e) {
                    console.error("Error creating will:", e);
                  }
                  }}>
                  Create Will
                </button>
              </form>
            </div> 
            </div>
          </div>
        </div>
      </div>          
    
            {/* <div className="space-y-2">
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
            </div> */}    
      
      
      <ul className="steps steps-horizontal">
        <li className="step step-primary">Connect</li>
        <li className="step step-primary">Register</li>
        <li className="step step-primary">Create Will</li>
        <li className="step">Add Assets</li>
        <li className="step">Add beneficiaries</li>
        <li className="step">Finish</li>
      </ul>
      {/* <div className="join grid grid-cols-2">
        <button className="join-item btn btn-outline">Previous page</button>
        <button className="join-item btn btn-outline">Next</button>
      </div> */}
   
  </div>
    
  );
}
