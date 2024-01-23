import crypto from "crypto";

const LEFT = "left";
const RIGHT = "right";

const hashes = [
  "0x95cd603fe577fa9548ec0c9b50b067566fe07c8a",
  "0x709b55bd3da0f5a838125bd0ee20c5bfdd7caba1",
  "0x27ca64c092a959c7edc525ed45e845b1de6a7590",
  "0x1f3cb18e896256d7d6bb8c11a6ec71f005c75de0",
  "0x41b637cfd9eb3e2f60f734f9ca44e5c1559c6f48",
  "0xa8c0cce8bb067e91cf2766c26be4e5d7cfba3d33",
  "0xd20a624740ce1b7e2c74659bb291f665c021d202",
  "0x281b9dba10658c86d0c3c267b82b8972b6c7b412",
  "0xdf743dd1973e1c7d46968720b931af0afa8ec5e8",
  "0x3e812f40cd8e4ca3a92972610409922dedf1c0db",
];

const sha256 = (data) => {
  return crypto.createHash("sha256").update(data).digest().toString("hex");
};

const getLeafNodeDirectionInMerkleTree = (hash, merkleTree) => {
  const hashIndex = merkleTree[0].findIndex((h) => h === hash);
  return hashIndex % 2 === 0 ? LEFT : RIGHT;
};

function ensureEven(hashes) {
  if (hashes.length % 2 !== 0) {
    hashes.push(hashes[hashes.length - 1]);
  }
}

//generateMerkleRoot
function generateMerkleRoot(hashes) {
  if (!hashes || hashes.length == 0) {
    return "";
  }
  ensureEven(hashes);
  const combinedHashes = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const hashPairConcatenated = hashes[i] + hashes[i + 1];
    const hash = sha256(hashPairConcatenated);
    combinedHashes.push(hash);
  }
  // If the combinedHashes length is 1, it means that we have the merkle root already
  // and we can return
  if (combinedHashes.length === 1) {
    return combinedHashes.join("");
  }
  return generateMerkleRoot(combinedHashes);
}

//getMerkleRootFromMerkleProof
function getMerkleRootFromMerkleProof(merkleProof) {
  if (!merkleProof || merkleProof.length === 0) {
    return "";
  }
  const merkleRootFromProof = merkleProof.reduce((hashProof1, hashProof2) => {
    if (hashProof2.direction === RIGHT) {
      const hash = sha256(hashProof1.hash + hashProof2.hash);
      return { hash };
    }
    const hash = sha256(hashProof2.hash + hashProof1.hash);
    return { hash };
  });
  return merkleRootFromProof.hash;
}

//generateMerkleTree
function generateMerkleTree(hashes) {
  if (!hashes || hashes.length === 0) {
    return [];
  }
  const tree = [hashes];
  const generate = (hashes, tree) => {
    if (hashes.length === 1) {
      return hashes;
    }
    ensureEven(hashes);
    const combinedHashes = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const hashesConcatenated = hashes[i] + hashes[i + 1];
      const hash = sha256(hashesConcatenated);
      combinedHashes.push(hash);
    }
    tree.push(combinedHashes);
    return generate(combinedHashes, tree);
  };
  generate(hashes, tree);
  return tree;
}

//generateMerkleProof
function generateMerkleProof(hash, hashes) {
  if (!hash || !hashes || hashes.length === 0) {
    return null;
  }
  const tree = generateMerkleTree(hashes);
  const merkleProof = [
    {
      hash,
      direction: getLeafNodeDirectionInMerkleTree(hash, tree),
    },
  ];
  let hashIndex = tree[0].findIndex((h) => h === hash);
  for (let level = 0; level < tree.length - 1; level++) {
    const isLeftChild = hashIndex % 2 === 0;
    const siblingDirection = isLeftChild ? RIGHT : LEFT;
    const siblingIndex = isLeftChild ? hashIndex + 1 : hashIndex - 1;
    const siblingNode = {
      hash: tree[level][siblingIndex],
      direction: siblingDirection,
    };
    merkleProof.push(siblingNode);
    hashIndex = Math.floor(hashIndex / 2);
  }
  return merkleProof;
}

const merkleRoot = generateMerkleRoot(hashes);

const generatedMerkleProof = generateMerkleProof(hashes[3], hashes);

const merkleTree = generateMerkleTree(hashes);

const merkleRootFromMerkleProof =
  getMerkleRootFromMerkleProof(generatedMerkleProof);

console.log("merkleRoot: ", merkleRoot);
console.log("generatedMerkleProof: ", generatedMerkleProof);
console.log("merkleTree: ", merkleTree);
console.log("merkleRootFromMerkleProof: ", merkleRootFromMerkleProof);
console.log(
  "merkleRootFromMerkleProof === merkleRoot: ",
  merkleRootFromMerkleProof === merkleRoot
);
