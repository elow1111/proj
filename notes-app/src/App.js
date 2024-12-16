import React from 'react';
import AppRouter from './router/AppRouter';
import './App.css';
import newLogo from './assets/logo.png';

const App = () => (
  <div className="App">
    <header className="App-header">
      <div className="logo-container">
        <img src={newLogo} className="App-logo" alt="new logo" />
      </div>
      <AppRouter />
    </header>
  </div>
);

export default App;
