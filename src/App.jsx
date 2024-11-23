import React from 'react';
import HashCalculator from './components/HashCalculator'; // Assuming you have this component
import Blockchain from './components/Blockchain';
import DistributedBlockchain from './components/DistributedBlockchain';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

function App() {
  return (
    <div className="App">
      <div className="container my-5">
        <h1 className="text-center">React Blockchain Simulator</h1>
        <hr />
        <HashCalculator />
        <hr />
        <h2>Simple Blocks</h2>
        <Blockchain />
        <hr />
        <DistributedBlockchain />
      </div>
    </div>
  );
}

export default App;