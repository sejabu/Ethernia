import logo from './logo.svg';
import './App.css';
import React from 'react';
import ConnectWallet from './components/connectWallet.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Ethernia</h1>
        <ConnectWallet />  
      </header>
    </div>
  );
}

export default App;
