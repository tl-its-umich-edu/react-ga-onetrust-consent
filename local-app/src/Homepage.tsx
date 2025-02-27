import React from 'react';
import './App.css';
import logo from './logo.svg';

function Homepage(): JSX.Element {
   return (
   <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="/page2">Page2</a>
      </header>
    </div>
   )
}
export default Homepage