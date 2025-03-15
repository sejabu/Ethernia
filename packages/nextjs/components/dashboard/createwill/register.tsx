'use client';

import React, { useState, useEffect } from 'react';
import { LuMail, LuUsers } from 'react-icons/lu';
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
  const [activeTab, setActiveTab] = useState('create');
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeEtherniaAsync } = useScaffoldWriteContract({
    contractName: "Ethernia",
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div defaultValue="manage" className="w-full">
        <div className='card'>
          <h2 className='card-title'>Notification Suscription</h2>
          <div className="card-body flex mx-auto flex-row">
            <span className="mr-14"><PushNotificationManager  /></span>
            <span><InstallPrompt /></span>
          </div>
          <h2 className='card-title'>Account Info</h2>
          <div className="card-bordereddy space-y-4">
              <div className="space-y-2">
                <label className="block font-medium">Add/Change Email</label>
                <div className="flex items-center space-x-2">
                  <LuMail className="h-5 w-5 text-gray-500" />
                  <input type="text" placeholder="example@mail.com" className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-medium">Add/Change Name</label>
                <div className="flex items-center space-x-2">
                  <LuUsers className="h-5 w-5 text-gray-500" />
                  <input type="text" placeholder="Input your name" className="w-full p-2 border rounded" />
                </div>
                <button className="btn btn-primary" onClick={async () => {
                  try {
                    await writeEtherniaAsync({
                      functionName: "registerUser",
                    });
                  } catch (error) {
                    console.error("Error renewing life proof:", error);
                  }
                }}>
                  Register User
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
