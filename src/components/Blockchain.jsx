// Blockchain Component: Manages the state and behavior for a blockchain representation
import React, { useState } from "react";
import Block from "./Block"; // Importing the Block component to render individual blocks in the blockchain

function Blockchain({ blockchainId, updateHighlightedBlock, highlightedBlocks }) {
  // State to hold the blocks of the blockchain, initialized with the Genesis Block
  const [blocks, setBlocks] = useState([
    { id: 1, data: "Genesis Block", nonce: 0, previousHash: "0", hash: "" },
  ]);

  // Function to add a new block to the blockchain
  const addBlock = () => {
    const previousBlock = blocks[blocks.length - 1]; // Get the previous block to link it to the new one
    const newBlock = {
      id: blocks.length + 1, // New block ID is the length of the blocks array + 1
      data: "",
      nonce: 0, // Initially unmined (nonce = 0)
      previousHash: previousBlock.hash || "0", // Set the previous block's hash as the new block's previousHash
      hash: "",
    };
    setBlocks([...blocks, newBlock]); // Add the new block to the blockchain state
  };

  // Function to update an existing block with new data or mined information
  const updateBlock = (id, updatedBlock) => {
    const newBlocks = blocks.map((block, index) => {
      if (block.id === id) {
        return { ...block, ...updatedBlock }; // Update the block if the ID matches
      }
      // Update the previousHash for blocks after the first one
      if (index > 0 && index === id - 1) {
        const previousBlock = newBlocks[index - 1];
        block.previousHash = previousBlock.hash;
      }
      return block; // Return the unmodified block
    });

    setBlocks(newBlocks); // Update the blockchain state with modified blocks
    updateHighlightedBlock(blockchainId, id, updatedBlock); // Update the highlighted block (indicating validity)
  };

  return (
    <div>
      <div className="blockchain">
        {/* Render all the blocks in the blockchain */}
        {blocks.map((block) => (
          <Block
            key={block.id}
            block={block} // Pass the block data to the Block component
            updateBlock={updateBlock} // Pass the updateBlock function to modify blocks
            isHighlighted={highlightedBlocks && highlightedBlocks[block.id] ? highlightedBlocks[block.id] : (block.nonce === 0 ? "invalid" : "")} // Highlight invalid or valid blocks
          />
        ))}
      </div>
      <button className="add-block" onClick={addBlock}>  
        Add Block
      </button> 
    </div>
  );
}

export default Blockchain;
