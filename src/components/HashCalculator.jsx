// HashCalculator Component: Allows users to input data and calculate its SHA256 hash
import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; 

const HashCalculator = () => {
  // State to manage the input data for hash calculation
  const [data, setData] = useState('');
  const hash = CryptoJS.SHA256(data).toString(); // Calculate the SHA256 hash for the data

  return (
    <div className="hash-calculator">
      <h2>Algorithm SHA256 Hashing</h2>
      <div className="form-group">
        <label>Data:</label>
        <textarea
          className="form-control"
          rows="5"
          value={data}
          onChange={(e) => setData(e.target.value)} // Update the input data
        />
      </div>
      <div className="form-group">
        <label>Hash:</label>
        <input
          type="text"
          className="form-control"
          value={hash} // Display the calculated hash
          disabled
        />
      </div>
    </div>
  );
};

export default HashCalculator;
