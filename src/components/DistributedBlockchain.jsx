import React, { useState, useEffect } from "react";
import Blockchain from "./Blockchain"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import useValidator from "../hooks/useValidator"; 

const DistributedBlockchain = () => {
  // State to manage highlighted blocks (valid/invalid) in each blockchain
  const [highlightedBlocks, setHighlightedBlocks] = useState({
    A: {},
    B: {},
    C: {},
  });

  // State to manage the data for each blockchain (A, B, C)
  const [blockchains, setBlockchains] = useState({
    A: [{ id: 1, data: "Genesis Block", nonce: 0, previousHash: "0", hash: "" }],
    B: [{ id: 1, data: "Genesis Block", nonce: 0, previousHash: "0", hash: "" }],
    C: [{ id: 1, data: "Genesis Block", nonce: 0, previousHash: "0", hash: "" }],
  });

  // State for managing alert messages
  const [alertMessage, setAlertMessage] = useState(null);

  // Using the custom hook for block validation
  const validateBlock = useValidator(blockchains, setHighlightedBlocks, setAlertMessage);

  // useEffect hook to validate all blocks in all blockchains whenever the blockchains state changes
  useEffect(() => {
    // Iterate through each blockchain and validate all blocks except the first one (Genesis Block)
    Object.keys(blockchains).forEach((blockchainId) => {
      blockchains[blockchainId].forEach((block, index) => {
        if (index !== 0) {
          // Validate the block if it's not the first block
          validateBlock(index + 1, block); // Now only passing index + 1 and block
        }
      });
    });
  }, [blockchains, validateBlock]); // No need to include blockchainId in dependencies

  // Function to update a specific block in the blockchain
  const updateHighlightedBlock = (blockchainId, blockId, updatedBlock) => {
    setBlockchains((prevState) => {
      const updatedBlockchain = [...prevState[blockchainId]];
      // Update the block using the blockId (1-based index, hence blockId-1)
      updatedBlockchain[blockId - 1] = updatedBlock;
      return {
        ...prevState,
        [blockchainId]: updatedBlockchain,
      };
    });
  };

  return (
    <div className="distributed-blockchain">
      <h2>Distributed Blockchain</h2>
      <div className="row">
        <div className="col-md-4">
          <h4>Machine A</h4>
          {/* Render Blockchain component for Machine A */}
          <Blockchain
            blockchainId="A"
            updateHighlightedBlock={updateHighlightedBlock}
            highlightedBlocks={highlightedBlocks.A || {}}
          />
        </div>
        <div className="col-md-4">
          <h4>Machine B</h4>
          {/* Render Blockchain component for Machine B */}
          <Blockchain
            blockchainId="B"
            updateHighlightedBlock={updateHighlightedBlock}
            highlightedBlocks={highlightedBlocks.B || {}}
          />
        </div>
        <div className="col-md-4">
          <h4>Machine C</h4>
          {/* Render Blockchain component for Machine C */}
          <Blockchain
            blockchainId="C"
            updateHighlightedBlock={updateHighlightedBlock}
            highlightedBlocks={highlightedBlocks.C || {}}
          />
        </div>
      </div>

      {/* Display alert message if any critical inconsistency is detected */}
      {alertMessage && (
        <div className="alert alert-danger alert-custom" role="alert">
          <strong>Critical Alert!</strong> {alertMessage}
        </div>
      )}

      {/* Toast container for displaying toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default DistributedBlockchain;
