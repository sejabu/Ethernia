import logo from './logo.svg';
import './App.css';
import React from 'react';
import ConnectWallet from './components/connectWalletonnectWallet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to LastBlock</h1>
        <ConnectWallet />  // Añade el botón para conectar la wallet
      </header>
    </div>
  );
}

export default App;
