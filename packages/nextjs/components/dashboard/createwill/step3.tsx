'use client';

import { LuClock, LuScrollText } from 'react-icons/lu';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { PiNumberCircleThree } from 'react-icons/pi';


export default function Create() {

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  return (
    <div className='flex flex-col justify-center space-x-4 mt-2 w-3/4 mx-auto'>
      <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
          <h3 className='card-title justify-center'><PiNumberCircleThree />&nbsp;Create your Will</h3>
          <div className='flex flex-col space-x-0 space-y-4 justify-center lg:flex-row lg:space-x-4 lg:space-y-0'>
            <div className="card bg-base-100 w-auto lg:w-3/4 shadow-sm flex: 1">
            <div className="flex flex-col items-center w-full justify-center p-4">
              <form className="space-y-4 w-full">
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
                  <label className="block mb-1 text-sm font-medium">Renewal Period (In days, usually 182)</label>
                  <div className="relative">
                    <input
                      id="renewalPeriod"
                      type="number"
                      placeholder="This is now set it to minutes for testing purposes❗❗"
                      className="w-full px-10 py-2 border rounded-md"
                    />
                    <LuClock className="absolute top-2.5 left-3 text-gray-400" size={18} />
                  </div>
                </div>
                <button
                  className="w-full btn btn-primary"
                  onClick={async (event) => {
                    event.preventDefault(); // Stop default form submission
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
      <ul className="steps steps-horizontal">
        <li className="step step-primary">Connect</li>
        <li className="step step-primary">Register</li>
        <li className="step step-primary">Create Will</li>
        <li className="step">Add Assets</li>
        <li className="step">Add beneficiaries</li>
        <li className="step">Finish</li>
      </ul>
    </div>    
  );
}
