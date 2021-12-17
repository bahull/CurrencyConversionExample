import React from 'react';
import Header from './components/Header/Header'
import logo from './logo.svg';
import './App.css';
import sdk from './utils/upholdClient'
import ConversionView from './components/ConversionView/ConversionView';

console.log(sdk)
function App() {
  return (
    <div className="App">
      <Header />
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <ConversionView />

      </div>
    </div>
  );
}

export default App;
