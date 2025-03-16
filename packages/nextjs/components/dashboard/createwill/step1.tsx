'use client';

import {useRouter} from 'next/navigation';
import { PiNumberCircleOne } from "react-icons/pi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

  
export default function Connect() {

    return (
        <div className='flex flex-col justify-center space-x-4 mt-2 w-3/4 mx-auto'>
            <div className='card card-bordered bg-base-300 mb-6'>
                <div className='card-body'>
                    <h3 className='card-title justify-center'>Welcome to Ethernia</h3>
                    <div className='flex flex-col space-x-0 space-y-4 justify-center lg:flex-row lg:space-x-4 lg:space-y-0'>
                        <div className="card bg-base-100 w-auto lg:w-3/4 shadow-sm flex: 1">
                            <figure className="px-10 pt-10">
                                <img
                                src="/ethernia-logo-94x94.png"
                                alt="Ethernia Logo"
                                className="rounded-xl" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">This is the first step to Secure Your Crypto Legacy</h2>
                                <p>We will be guiding you to easily register and set up your digital inheritance plan.</p>
                                <h2 className="card-title"><PiNumberCircleOne />&nbsp;Connect your Wallet:</h2>
                                <div className="card-actions">
                                    <ConnectButton />
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <ul className="steps steps-horizontal">
                <li className="step step-primary">Connect</li>
                <li className="step">Register</li>
                <li className="step">Create Will</li>
                <li className="step">Add Assets</li>
                <li className="step">Add beneficiaries</li>
                <li className="step">Finish</li>
            </ul>        
        </div>
    )
}