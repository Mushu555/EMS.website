// blockchain.js

class Blockchain {
  constructor() {
      this.chain = [];
  }

  addBlock(data) {
      const block = {
          data: data,
          timestamp: new Date(),
          // Add other properties like previous hash, index, etc.
      };
      this.chain.push(block);
  }

  verifyData(data) {
      // Hash the provided data
      const hashedData = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
      
      // Check if the hash exists in any block
      for (const block of this.chain) {
          if (block.data === hashedData) {
              return true; // Data is verified
          }
      }

      return false; // Data not found in the blockchain
  }
}

module.exports = { Blockchain };
