import crypto from "crypto";

// Function to create a SHA-256 hash of a value
function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Function to create a Merkle Tree
function createMerkleTree(leaves) {
  if (leaves.length % 2 !== 0) {
    // If the number of leaves is odd, duplicate the last leaf
    leaves.push(leaves[leaves.length - 1]);
  }

  const tree = [];

  // Create leaf nodes (hash each address)
  const leafNodes = leaves.map((leaf) => sha256(leaf));

  // Initialize the tree with leaf nodes
  tree.push(...leafNodes);

  // Build the tree level by level
  for (
    let levelSize = leaves.length;
    levelSize > 1;
    levelSize = Math.ceil(levelSize / 2)
  ) {
    const level = [];

    for (let i = 0; i < levelSize; i += 2) {
      const left = tree[tree.length - levelSize + i];
      const right = tree[tree.length - levelSize + i + 1];
      const combined = sha256(left + right);
      level.push(combined);
    }

    tree.push(...level);
  }

  return tree;
}

// Dummy addresses
const dummyAddresses = [
  "0x123456789abcdef",
  "0x987654321fedcba",
  "0xabcdef123456789",
  "0xfedcba987654321",
  "0x13579bdf2468ace",
];

// Example: Create Merkle Tree
const merkleTree = createMerkleTree(dummyAddresses);

// Example: Verify an address using the Merkle Tree
const addressToVerify = "0xfedcba987654321"; // Change this to any dummy address

// Hash the address to be verified
const hashedAddress = sha256(addressToVerify);

// Check if the hashed address is present in the Merkle Tree
const isAddressValid = merkleTree.includes(hashedAddress);

console.log(`Merkle Tree Root: ${merkleTree[merkleTree.length - 1]}`);
console.log(`Is Address Valid: ${isAddressValid}`);
