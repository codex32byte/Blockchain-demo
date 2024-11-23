import { useRef } from "react";

const useValidator = (blockchains, setHighlightedBlocks, setAlertMessage) => {
  const alertRef = useRef(new Set()); // Reference to track unique alerts

  const validateBlock = (blockId, updatedBlock) => {
    // Skip the genesis block (blockId === 1) or blocks that don't start with "0000"
    if (blockId === 1 || !updatedBlock.hash.startsWith("0000")) return;

    const blockchainsCopy = { ...blockchains }; // Make a copy of the blockchains
    const updatedHighlightedBlocks = {}; // To keep track of updated highlighted blocks

    let nonces = {}; // To store the nonces from different machines
    let machinesWithDifferentNonces = []; // To store machines with different nonces

    // Gather nonces from all machines for the same block
    Object.keys(blockchainsCopy).forEach((machineId) => {
      const correspondingBlock = blockchainsCopy[machineId]?.[blockId - 1];
      if (correspondingBlock && correspondingBlock.hash.startsWith("0000")) {
        nonces[machineId] = correspondingBlock.nonce; // Collect the nonce from each machine
      }
    });

    const nonceArray = Object.values(nonces); // Get all nonce values
    const uniqueNonces = new Set(nonceArray); // Get unique nonces using a Set

    if (uniqueNonces.size === 2) {
      // If there are two unique nonces, we detect inconsistency
      Object.keys(nonces).forEach((machineId) => {
        const nonceCount = nonceArray.filter((nonce) => nonce === nonces[machineId]).length;
        if (nonceCount === 1) {
          machinesWithDifferentNonces.push(machineId); // Track machines with unique nonces
        }
      });

      const alertKey = machinesWithDifferentNonces.join(",");
      if (!alertRef.current.has(alertKey)) {
        // Trigger an alert for the detected inconsistency
        setAlertMessage(`🚨 Inconsistency detected! Machine(s) ${machinesWithDifferentNonces.join(", ")} may be cheating. Nonces: ${JSON.stringify(nonces)}`);
        alertRef.current.add(alertKey); // Track that the alert has been triggered for these machines
      }
    }

    // Update highlighted blocks based on the nonce inconsistency
    Object.keys(blockchainsCopy).forEach((machineId) => {
      if (machinesWithDifferentNonces.includes(machineId)) {
        updatedHighlightedBlocks[machineId] = {
          ...updatedHighlightedBlocks[machineId],
          [blockId]: "invalid", // Mark the block as invalid if the nonce is inconsistent
        };
      } else {
        updatedHighlightedBlocks[machineId] = {
          ...updatedHighlightedBlocks[machineId],
          [blockId]: "valid", // Otherwise, mark the block as valid
        };
      }
    });

    // Update the highlighted blocks state with the updated values
    setHighlightedBlocks((prevState) => ({
      ...prevState,
      ...updatedHighlightedBlocks,
    }));
  };

  return validateBlock;
};

export default useValidator;
