'use client';

import React, { useState, useEffect } from 'react';
import { FormEvent } from "react";
import { LuCheck, LuLoader, LuMail } from 'react-icons/lu';
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { subscribeUser, unsubscribeUser, sendNotification } from '~~/app/actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
 
  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }
 
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }
 
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }
 
  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  
  return (
      <div>
        {subscription ? (
          <>
            <p className="text-primary">You are subscribed to push notifications.</p>
            <button className="btn btn-secondary" onClick={unsubscribeFromPush}>Unsubscribe</button>
            <input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendTestNotification}>Send Test</button>
          </>
        ) : (
          <>
            <p className="text-warning">You are not subscribed to push notifications.</p>
            <button className="btn btn-primary" onClick={subscribeToPush}>Subscribe</button>
          </>
        )}
      </div>
    )
  }

  function InstallPrompt() {
      const [isIOS, setIsIOS] = useState(false)
      const [isStandalone, setIsStandalone] = useState(false)
     
      useEffect(() => {
        setIsIOS(
          /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        )
     
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
      }, [])
     
      if (isStandalone) {
        return null // Don't show install button if already installed
      }
     
      return (
        <div>
          <p>Install App</p>
          <button className="btn btn-primary">Add to Home Screen</button>
          {isIOS && (
            <p>
              To install this app on your iOS device, tap the share button
              <span role="img" aria-label="share icon">
                {' '}
                ⎋{' '}
              </span>
              and then "Add to Home Screen"
              <span role="img" aria-label="plus icon">
                {' '}
                ➕{' '}
              </span>.
            </p>
          )}
        </div>
      )
    }



export default function UserAccount () {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

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
          walletAddress: connectedAddress,
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
          walletAddress: connectedAddress,
          embeddedWallet: false,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
  
      await writeEtherniaAsync({
        functionName: "registerUser",
      });
      
    } catch (err: unknown) {
      console.error("Verification or registration error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsVerifying(false);
      }
  };


  return (
    <div className='flex flex-col justify-center mt-2 w-3/4 mx-auto'>  
      <div className="card card-bordered bg-base-300 mb-6">
        <div className="card-body">
          <h2 className='card-title justify-center'>Account Info</h2>       
          {!isEmailSent ? (
            <form onSubmit={handleSendVerificationCode} className="space-y-4 w-full">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Register Email (*)
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-10 py-2 border rounded-md"
                    placeholder="example@email.com (required)"
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
              {/* <button
                    type="button"
                    onClick={() => setIsEmailSent(false)}
                    className="w-full py-2 text-sm text-blue-600 underline"
                  >
                  Change email address
                  </button> */}
            </form>
          )} 
        </div>
      </div>
      
      <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
          <h3 className='card-title justify-center'>Config Notifications</h3>
          <div role="alert" className="alert alert-vertical sm:alert-horizontal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span><PushNotificationManager  /></span>
            <div>
              <InstallPrompt />
            </div>
          </div>    
        </div>       
      </div>
    </div>  
  );
}
