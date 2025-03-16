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
                {currentStep < steps.length - 1 && (
                <span className='flex justify-center'><button className="btn btn-primary" onClick={handleNext}>Next</button></span>
                )}
            </div>
        </Suspense>
    );
}
