'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuMail, LuUsers } from 'react-icons/lu';
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { subscribeUser, unsubscribeUser, sendNotification } from '~~/app/actions'
import { PiNumberCircleSix } from 'react-icons/pi';

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
            <p>You are not subscribed to push notifications.</p>
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



export default function Notifications () {
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  return (
    <div className='flex flex-col justify-center space-x-4 mt-2 w-1/2 mx-auto'>
          <div className='card card-bordered bg-base-300 mb-6'>
            <div className='card-body'>
              <h3 className='card-title justify-center'><PiNumberCircleSix />&nbsp;Config Notifications</h3>

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
            <div className="className='card-body'">
              <div className="flex justify-center">
                <button className="btn btn-primary mb-2" onClick={()=>(
                  document.getElementById('my_modal_5') as HTMLDialogElement).showModal()}>
                  Finish
                </button>
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Congratulations! Your digital Will was created.</h3>
                    <p className="py-4 jus">Now you will be redirected to the dashboard page, so you can check all it's ok.</p>
                    <p className="py-4 jus">Remember periodically login and set your proof of life.</p>
                    <div className="modal-action justify-center">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <Link href="/dashboard">
                        <button className="btn">Go to Dashboard</button>
                        </Link>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
      
      <ul className="steps steps-horizontal">
        <li className="step step-primary">Connect</li>
        <li className="step step-primary">Register</li>
        <li className="step step-primary">Create Will</li>
        <li className="step step-primary">Add Assets</li>
        <li className="step step-primary">Add beneficiaries</li>
        <li className="step step-primary">Finish</li>
      </ul>
    </div>
  );
}
