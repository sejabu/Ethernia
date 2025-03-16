"use client";

import { PiNumberCircleOne, PiNumberCircleTwo } from "react-icons/pi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuMail, LuCheck, LuLoader } from "react-icons/lu";
import { FormEvent } from "react";
import { useAccount } from "wagmi";



export default function Register() {
    const { address: connectedAddress } = useAccount();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendVerificationCode = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        try {
          const response = await fetch("/api/auth/send-verification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              email,
              walletAddress: {connectedAddress},
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || "Failed to send verification code");
          }
    
          setIsEmailSent(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setLoading(false);
        }
      };
    
      const handleVerifyCode = async (e: FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");
    
        try {
          const response = await fetch("/api/auth/verify-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              code: verificationCode,
              walletAddress: {connectedAddress},
              embeddedWallet: false,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || "Verification failed");
          }
    
          // Get JWT token from Privy
          //const token = await getAccessToken();
    
          // Redirect to login page to authenticate with Next-Auth
          // router.push(`/api/auth/callback/privy?token=${token}`);
            } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
               setIsVerifying(false);
            }
        };


    return (
        <div className='flex flex-col justify-center space-x-4 mt-2 w-3/4 mx-auto'>
            <div className='card card-bordered bg-base-300 mb-6'>
                <div className='card-body'>
                    <h3 className='card-title justify-center'><PiNumberCircleTwo />&nbsp;Register your Email</h3>
                    <div className='flex flex-col space-x-0 space-y-4 justify-center lg:flex-row lg:space-x-4 lg:space-y-0'>
                        <div className="card bg-base-100 w-auto lg:w-3/4 shadow-sm flex: 1">
                            <div className="flex flex-col items-center justify-center p-4">
                                {!isEmailSent ? (
                                    <form onSubmit={handleSendVerificationCode} className="space-y-4 w-full">
                                        <div>
                                            <label htmlFor="email" className="block mb-1 text-sm font-medium">
                                            Email Address
                                            </label>
                                            <div className="relative">
                                                <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-10 py-2 border rounded-md"
                                                placeholder="your@email.com"
                                                required
                                                />
                                                <LuMail className="absolute top-2.5 left-3 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        {error && <p className="text-sm text-red-600">{error}</p>}
                                        <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary flex items-center justify-center py-2 space-x-2 w-full"
                                        >
                                        {loading ? (
                                        <>
                                            <LuLoader size={18} className="animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                        ) : (
                                            <span>Send Verification Code</span>
                                        )}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyCode} className="space-y-4">
                                        <p className="text-sm text-green-600">
                                            A verification code has been sent to {email}
                                        </p>
                                        <div>
                                            <label htmlFor="code" className="block mb-1 text-sm font-medium">
                                                Verification Code
                                            </label>
                                            <input
                                                id="code"
                                                type="text"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-sm text-red-600">{error}</p>}
                                        <button
                                            type="submit"
                                            disabled={isVerifying}
                                            className="flex items-center justify-center w-full py-2 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                        >
                                        {isVerifying ? (
                                        <>
                                            <LuLoader size={18} className="animate-spin" />
                                            <span>Verifying...</span>
                                        </>
                                          ) : (
                                        <>
                                            <LuCheck size={18}/>
                                            <span>Verify Code</span>
                                        </>
                                        )}
                                        </button> 
                                        <button
                                            type="button"
                                            onClick={() => setIsEmailSent(false)}
                                            className="w-full py-2 text-sm text-blue-600 underline"
                                        >
                                            Change email address
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            <ul className="steps steps-horizontal">
                <li className="step step-primary">Connect</li>
                <li className="step step-primary">Register</li>
                <li className="step">Create Will</li>
                <li className="step">Add Assets</li>
                <li className="step">Add beneficiaries</li>
                <li className="step">Finish</li>
            </ul>
        </div>     
    );
}