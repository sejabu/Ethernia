'use client';

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LuCheck } from 'react-icons/lu';

export default function DeleteWill () {

  return (
    <div className="w-full max-w-6xl mx-auto p-0 space-y-0">
      <div defaultValue="status" className="w-full"> 
        <div className='card'>
          <h2 className='card-title'>Will Status</h2>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 shadow rounded">
                <div className="flex items-center space-x-2">
                  <LuCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Will Status</p>
                    <p className="text-sm text-green-600">Active</p>
                  </div>
                </div>
              </div>
              <div className="p-4 shadow rounded">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium">Deactive Will?</p>
                    <div className="flex space-x-2 h-8 items-center justify-center text-sm">
                      <XMarkIcon className="swap-on h-5 w-5" />
                      <CheckIcon className="swap-off h-5 w-5" /> 
                    </div>
                  </div>
                </div>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
}
