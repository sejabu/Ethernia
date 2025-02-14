// src/components/ConnectWallet.js
import React from 'react';
import { ethers } from 'ethers'; // Esto es correcto para funciones generales y objetos.

// Si necesitas usar Web3Provider, debes importar directamente desde 'ethers'
import { Web3Provider } from '@ethersproject/providers'; // Esta es la forma correcta de importar Web3Provider.

const ConnectWallet = () => {
  const connectWalletHandler = async () => {
    if (window.ethereum) { // Verifica si el navegador tiene MetaMask
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Solicita acceso a la cuenta
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner(); // Obtiene el signer para interactuar con la blockchain
        const address = await signer.getAddress(); // Obtiene la dirección de la wallet conectada
        console.log("Wallet address:", address);
        alert(`Wallet connected: ${address}`); // Muestra un mensaje con la dirección conectada
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!"); // Alerta si MetaMask no está instalado
    }
  };

  return <button onClick={connectWalletHandler}>Connect to MetaMask to login </button>;
};

export default ConnectWallet;
