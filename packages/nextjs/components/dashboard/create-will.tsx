'use client';

import { LuClock, LuScrollText } from 'react-icons/lu';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth';


export default function CreateWill() {

  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 ">
      <div defaultValue="create" className="w-full">
      <div className='card'>
            <div className="card-title sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 z-20 justify-around shadow-sm px-0 sm:px-2">
              <p>Create Digital Will - Testator address:</p>
              <Address address={connectedAddress} format="long" />
            </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Will Name</label>
                <div className="flex items-center space-x-2">
                  <LuScrollText className="h-5 w-5 text-gray-500" />
                  <input id="willName" type="text" placeholder="Put a name to your will (can be anything)" className="w-full p-2 border rounded" />
                  
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="block font-medium">Renewal Period</label>
                <div className="flex items-center space-x-2">
                  <LuClock className="h-5 w-5 text-gray-500" />
                  <input id="renewalPeriod" type="number" placeholder="Time in days (minutes for test)" className="w-full p-2 border rounded" />
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
          </div>
          </div>
      </div>
      <div className="join grid grid-cols-2">
        <button className="join-item btn btn-outline">Previous page</button>
        <button className="join-item btn btn-outline">Next</button>
      </div>
      <ul className="steps steps-horizontal">
        <li className="step step-primary">Registert</li>
        <li className="step step-primary">Create Will</li>
        <li className="step">Add Assets</li>
        <li className="step">Add beneficiaries</li>
      </ul>
   
    </div>
  );
}
