'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Connect from "~~/components/dashboard/createwill/step1";
import Register from "~~/components/dashboard/createwill/step2";
import Create from "~~/components/dashboard/createwill/step3";
import Assets from "~~/components/dashboard/createwill/step4";
import Beneficiaries from "~~/components/dashboard/createwill/step5";
import Notifications from "~~/components/dashboard/createwill/step6";


export default function CreateWillPage() {
        const [currentStep, setCurrentStep] = useState(0); // Tracks the current step
      
        const steps = [
          <Connect key="step1" />,
          <Register key="step2" />,
          <Create key="step3" />,
          <Assets key="step4" />,
          <Beneficiaries key="step5" />,
          <Notifications key="step6" />,
        ];
      
        const handleNext = () => {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1); // Move to the next step
          }
        };
        const handleBack = () => {
            if (currentStep > 0 && currentStep !== 0) {
              setCurrentStep(currentStep - 1); // Move to the back step
            }
          };
        
    return (
        <Suspense fallback={
            <div className='flex justify-center h-screen space-x-4'>
                <span className="loading loading-bars loading-xs"></span>
                <span className="loading loading-bars loading-sm"></span>
                <span className="loading loading-bars loading-md"></span>
                <span className="loading loading-bars loading-lg"></span>
                <span className="loading loading-bars loading-xl"></span>
            </div>
            }>
            <div className="min-h-screen">
                {steps[currentStep]} {/* Render the current step */}
                
                <div className="join grid grid-cols-2 justify-center space-x-4 mt-2 w-1/2 mx-auto">
                    {currentStep > 0 && (
                        <button className="join-item btn btn-secondary" onClick={handleBack}>Previous page</button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <button className="join-item btn btn-primary" onClick={handleNext}>Next</button>
                    )}    
                </div>
                
            </div>
        </Suspense>
    );
}
