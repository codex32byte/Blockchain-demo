// Block Component: Handles the individual blocks, their mining process, and data modification
import React, { useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256"; 

function Block({ block, updateBlock, isHighlighted }) {
  // States to manage the block data, nonce (for mining), and hash
  const [data, setData] = useState(block.data);
  const [nonce, setNonce] = useState(block.nonce);
  const [hash, setHash] = useState("");

  // Recalculate the hash whenever data, nonce, or previousHash changes
  useEffect(() => {
    setHash(calculateHash(data, nonce, block.previousHash));
  }, [data, nonce, block.previousHash]);

  // Function to calculate the hash for the block using SHA256
  function calculateHash(data, nonce, previousHash) {
    return SHA256(data + nonce + previousHash).toString(); // Concatenate data, nonce, and previousHash and calculate hash
  }

  // Handle the mining process, increase nonce until the hash meets the target condition (starts with "0000")
  const handleMine = () => {
    let newNonce = nonce;
    let newHash = hash;
    const target = "0000"; // Target for mining (the hash must start with "0000")

    // Increment nonce until the hash starts with the target string
    while (!newHash.startsWith(target)) {
      newNonce++;
      newHash = calculateHash(data, newNonce, block.previousHash); // Recalculate the hash for the new nonce
    }

    setNonce(newNonce); // Set the new nonce
    setHash(newHash); // Set the mined hash
    updateBlock(block.id, { data, nonce: newNonce, hash: newHash }); // Update the block data
  };

  // Handle the change in block data
  const handleChange = (e) => {
    const newData = e.target.value;
    setData(newData); // Update the data
    const newHash = calculateHash(newData, nonce, block.previousHash); // Recalculate hash based on new data
    setHash(newHash);
    updateBlock(block.id, { data: newData, hash: newHash }); // Update the block with the new data and hash
  };

  // Check if the block is unmined (no hash or nonce is zero)
  const isUnminted = !hash || nonce === 0;
  
  // Determine if the block is valid (hash starts with "0000")
  const isValid = hash.startsWith("0000");

  return (
    <div className={`block ${isUnminted ? "invalid" : isHighlighted === "invalid" ? "invalid" : isValid ? "valid" : ""}`}>
      {/* Render block details: ID, data, nonce, previousHash, and hash */}
      <p>Block {block.id}</p>
      <textarea value={data} onChange={handleChange} placeholder="Enter data" />
      <p>Nonce: {nonce}</p>
      <p>Previous Hash: {block.previousHash}</p>
      <p>Hash: {hash}</p>
      <button onClick={handleMine}>Mine</button> {/* Button to start mining the block */}
    </div>
  );
}

export default Block;
