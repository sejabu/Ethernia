'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '~~/components/ui/card';
import { Mail, Users, FileText, AlertTriangle, Check, Key, Shield, Loader } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { ethers } from 'ethers';
import { useToast } from "~~/components/ui/use-toast"; // Assuming you have a toast component

// Contract ABI - Replace with your actual ABI
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"LifeProofSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bytes32","name":"commitment","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"UserRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bytes32","name":"newCommitment","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"UserUpdated","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"bytes32","name":"personalInfoCommitment","type":"bytes32"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"lastLifeProof","type":"uint256"},{"internalType":"bool","name":"isTestator","type":"bool"},{"internalType":"uint256","name":"dataVersion","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_personalInfoCommitment","type":"bytes32"},{"internalType":"bool","name":"_isTestator","type":"bool"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"submitLifeProof","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_newPersonalInfoCommitment","type":"bytes32"}],"name":"updatePersonalInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_personalInfoHash","type":"bytes32"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"verifyPersonalInfo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xYourContractAddressHere";

// API URL for backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function UserAccount() {
  const { address: connectedAddress, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('manage');
  const { toast } = useToast();
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    securityKey: '',
    isRegistered: false,
    isTestator: false,
    isLoading: false,
    error: null,
    successMessage: null,
    dataVersion: 0
  });

  // Check if user is registered when component mounts
  useEffect(() => {
    if (isConnected && connectedAddress) {
      checkUserRegistration();
    }
  }, [connectedAddress, isConnected]);

  // Check if user exists on the blockchain
  const checkUserRegistration = async () => {
    try {
      setUserData(prev => ({ ...prev, isLoading: true }));
      
      // Connect to provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Get user info from blockchain
      const userInfo = await contract.userInfo(connectedAddress);
      
      if (userInfo.wallet !== ethers.constants.AddressZero) {
        setUserData(prev => ({ 
          ...prev, 
          isRegistered: true,
          isTestator: userInfo.isTestator,
          dataVersion: userInfo.dataVersion.toNumber(),
          isLoading: false 
        }));
      } else {
        setUserData(prev => ({ 
          ...prev, 
          isRegistered: false,
          isLoading: false 
        }));
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      setUserData(prev => ({ 
        ...prev, 
        error: "Failed to check registration status",
        isLoading: false 
      }));
    }
  };

  // Generate hash commitment for user data
  const generateCommitment = (name, email) => {
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(['string', 'string'], [name, email])
    );
  };

  // Generate encryption key from user passphrase
  const generateEncryptionKey = async (passphrase) => {
    const encoder = new TextEncoder();
    const passphraseBuffer = encoder.encode(passphrase);
    const salt = encoder.encode(connectedAddress.toLowerCase());
    
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passphraseBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const keyBuffer = await window.crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(keyBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Handle registration or update
  const handleSaveUserInfo = async () => {
    if (!userData.name || !userData.email || !userData.securityKey) {
      setUserData(prev => ({ 
        ...prev, 
        error: "All fields are required, including security passphrase",
        successMessage: null 
      }));
      return;
    }

    if (userData.securityKey.length < 10) {
      setUserData(prev => ({ 
        ...prev, 
        error: "Security passphrase should be at least 10 characters",
        successMessage: null
      }));
      return;
    }

    try {
      setUserData(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));
      
      // Generate encryption key from passphrase
      const encryptionKey = await generateEncryptionKey(userData.securityKey);
      
      // Generate data commitment
      const dataCommitment = generateCommitment(userData.name, userData.email);
      
      // Connect to provider with signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Store data in backend
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: connectedAddress,
          name: userData.name,
          email: userData.email,
          encryptionKey: encryptionKey,
          isTestator: true // Since this is testator account
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to store data in backend');
      }
      
      // Submit to blockchain
      let tx;
      if (userData.isRegistered) {
        // Update existing user
        tx = await contract.updatePersonalInfo(dataCommitment);
      } else {
        // Register new user
        tx = await contract.registerUser(dataCommitment, true); // isTestator = true
      }
      
      // Wait for transaction
      await tx.wait();
      
      setUserData(prev => ({ 
        ...prev, 
        isRegistered: true,
        isTestator: true,
        dataVersion: prev.dataVersion + 1,
        isLoading: false,
        successMessage: userData.isRegistered ? "Profile updated successfully!" : "Profile created successfully!",
        error: null 
      }));
      
      // Display success toast
      toast({
        title: userData.isRegistered ? "Profile Updated" : "Profile Created",
        description: "Your information has been securely stored.",
        variant: "success"
      });
      
    } catch (error) {
      console.error("Error saving user info:", error);
      setUserData(prev => ({ 
        ...prev, 
        error: error.message || "Failed to save user information",
        successMessage: null,
        isLoading: false 
      }));
      
      // Display error toast
      toast({
        title: "Error",
        description: error.message || "Failed to save user information",
        variant: "destructive"
      });
    }
  };

  // Load user data from backend using encryption key
  const handleLoadUserData = async () => {
    if (!userData.securityKey) {
      setUserData(prev => ({ 
        ...prev, 
        error: "Security passphrase is required to decrypt your data",
        successMessage: null 
      }));
      return;
    }

    try {
      setUserData(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));
      
      // Generate encryption key from passphrase
      const encryptionKey = await generateEncryptionKey(userData.securityKey);
      
      // Get data from backend
      const response = await fetch(`${API_URL}/users/${connectedAddress}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptionKey: encryptionKey
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to retrieve user data');
      }
      
      const data = await response.json();
      
      setUserData(prev => ({ 
        ...prev, 
        name: data.name,
        email: data.email,
        isLoading: false,
        successMessage: "Data loaded successfully!",
        error: null 
      }));
      
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserData(prev => ({ 
        ...prev, 
        error: error.message || "Failed to load user data. Check your security passphrase.",
        successMessage: null,
        isLoading: false 
      }));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="manage" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Account</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Testator Account</CardTitle>
              {userData.isRegistered && (
                <div className="text-sm text-gray-500">
                  Version: {userData.dataVersion} • Last Updated: {new Date().toLocaleDateString()}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {userData.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{userData.error}</span>
                </div>
              )}
              
              {userData.successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-start">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{userData.successMessage}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block font-medium">Email</label>
                  {userData.isRegistered && (
                    <button 
                      onClick={handleLoadUserData}
                      className="text-xs text-blue-600 hover:text-blue-800"
                      disabled={userData.isLoading}
                    >
                      Load Saved Data
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="example@mail.com" 
                    className="w-full p-2 border rounded" 
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={userData.isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium">Full Name</label>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Input your name" 
                    className="w-full p-2 border rounded" 
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={userData.isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium">Security Passphrase</label>
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-gray-500" />
                  <input 
                    type="password" 
                    placeholder="Passphrase to encrypt your data" 
                    className="w-full p-2 border rounded" 
                    value={userData.securityKey}
                    onChange={(e) => setUserData(prev => ({ ...prev, securityKey: e.target.value }))}
                    disabled={userData.isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This passphrase is used to encrypt your personal data. Store it securely - you'll need it to decrypt your information.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium">Wallet Address</label>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div className="w-full p-2 border rounded bg-gray-50">
                    {connectedAddress ? <Address address={connectedAddress} /> : "No wallet connected"}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveUserInfo}
                disabled={userData.isLoading || !connectedAddress}
              >
                {userData.isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </span>
                ) : userData.isRegistered ? (
                  "Update Profile"
                ) : (
                  "Register Profile"
                )}
              </button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                <h3 className="font-bold text-lg mb-2">Your Data Privacy</h3>
                <p className="mb-3">
                  Your personal information is never stored directly on the blockchain.
                  Instead, we use a privacy-preserving approach:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your name and email are encrypted with your security passphrase</li>
                  <li>Only a hash (digital fingerprint) is stored on the blockchain</li>
                  <li>The encrypted data is stored off-chain in a secure database</li>
                  <li>No one can read your data without your security passphrase</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Life Proof Submission</h3>
                <p className="text-sm text-gray-600 mb-2">
                  As a testator, you need to periodically submit a life proof to confirm your account status.
                </p>
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={async () => {
                    try {
                      setUserData(prev => ({ ...prev, isLoading: true }));
                      
                      // Connect to provider with signer
                      const provider = new ethers.providers.Web3Provider(window.ethereum);
                      const signer = provider.getSigner();
                      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                      
                      // Submit life proof
                      const tx = await contract.submitLifeProof();
                      await tx.wait();
                      
                      setUserData(prev => ({ 
                        ...prev, 
                        isLoading: false,
                        successMessage: "Life proof submitted successfully!",
                        error: null 
                      }));
                      
                      toast({
                        title: "Life Proof Submitted",
                        description: "Your life proof has been recorded on the blockchain.",
                        variant: "success"
                      });
                      
                    } catch (error) {
                      console.error("Error submitting life proof:", error);
                      setUserData(prev => ({ 
                        ...prev, 
                        error: error.message || "Failed to submit life proof",
                        successMessage: null,
                        isLoading: false 
                      }));
                      
                      toast({
                        title: "Error",
                        description: error.message || "Failed to submit life proof",
                        variant: "destructive"
                      });
                    }
                  }}
                  disabled={userData.isLoading || !connectedAddress || !userData.isRegistered}
                >
                  {userData.isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Submit Life Proof"
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}