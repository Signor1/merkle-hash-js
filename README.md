## Merkle Tree

A Merkle Tree is a tree data structure (typically a binary tree) of hashes, where each leaf node contains the hash of a block of data, and each parent node contains the hash resulting from the concatenation and hashing of its children node's hashes.

This tree is used to verify and demonstrate that the hash of a leaf node is part of the hash of the root node in an efficient way, since we only need a small set of the hashes of the tree to carry out this verification.

This data structure is often used in distributed systems, like in Bitcoin and other blockchains, to verify if a transaction hash belongs to the Merkle root of a block header, in a lightweight, efficient and fast way.

The use of Merkle Tree/Root/Proof in Bitcoin allows the implementation of Simple Payment Verification (SPV), which is a way for lightweight clients to check if a transaction is actually part of a block, without the client having to download the whole block or the whole blockchain.
By only having the block header with the Merkle root, the transaction it wants to verify and the Merkle proof structure, obtained from a trusted bitcoin node, it can try to reconstruct the Merkle root and validate the transaction.

Ralph Merkle patented the hash tree in 1979, later named after him.

**Example of a Merke Tree**

From a list of hashes:

```
[95cd, 709b, 27ca, 1f3c, 41b6, a8c0, d20a, 281b, df74, 3e81]
```


<sub><sup>(These 4 characters hashes are short for longer, 64 characters hashes, to be shown later in the article</sup></sub>

Notice how the last hash, `3e81`, was copied and added to the end of the list. This is needed to be able to concatenate it with itself and hash it, since we hash in pair and if the hash list length is odd, then we copy and add the last to make the hash list even. The same happens with `fcc1`.
Each of the tree levels is called a hash list.

**Merkle Root**

The Merkle root is the root node of the tree. In our example above, it's the node with the **`da07`** hash.

**Merkle Proof**

A Merkle proof is a structure that holds the minimum needed hashes/nodes of a branch tree to be able to proof that a hash belongs to the Merkle root by recreating the Merkle root only with this information.


If we are interested in verifying if the hash *`41b6`* is actually included in the Merkle root (**`da07`**) then we would only need to have the hashes in color:

```
[41b6, a8c0, 1013, b5fb, f94a]
```

With `41b6`, we need `a8c0` to reconstruct `8fca`.
With `8fca`, we need `1013` to reconstruct `87fd`.
With `87fd`, we need `b5fb` to reconstruct `7460`.
With `7460` we need `f94a` to reconstruct **`da07`**, the Merkle root.

If after applying our hash (*`41b6`*) to the Merkle proof we get the expected **`da07`** Merkle root, then we know that our hash is part of the Merkle root.

In this case, for 11 hashes, we only needed 4 hashes, along our hash *`41b6`* to be able to reconstruct the Merkle root **`da07`**.

With this information, we notice a pattern and we can determine that we only need about log(n) number of nodes to be able to check if a hash belongs to a certain Merkle root, which is really efficient, instead of having to hash them all to verify that.

Something important that we need to have in mind is the order of concatenation of the hashes when we are creating and using the Merkle proof before hashing them:

*`41b6`* needs to be concatenated with `a8c0`, `41b6` being on the left and `a8c0` on the right:

```js
//...
const concatenatedHashes = '41b6' + 'a8c0';
//...
```
Because `41b6` is a left child, and `a8c0` is a right child.

The resulting hash `8fca` from the previous concatenation and hashing needs to be concatenated with `1013`, `8fca` being on the left and `1013` on the right, because `8fca` is a left child and `1013` is a right child.

The resulting hash `87fd` from the previous concatenation and hashing needs to be concatenated with `b5fb`, `87fd` being on the right and `b5fb` on the left, because `87fd` is a right child and `b5fb` is a left child.

The resulting hash `7460` from the previous concatenation and hashing needs to be concatenated with `f94a`, `7460` being on the left and `f94a` on the right, because `7460` is a left child and `f94a` is a right child.

We need to specify in the Merkle proof structure this direction that each node belongs to:

```js
const merkleProofFor41b6 = [
{
    hash: '41b6',
    direction: 'left'
},
{
    hash: 'a8c0',
    direction: 'right'
},
{
    hash: '1013',
    direction: 'right'
},
{
    hash: 'b5fb',
    direction: 'left'
},
{
    hash: 'f94a',
    direction: 'right'
}]
```
With this, our Merkle proof is complete and ready to be transferred and used.
