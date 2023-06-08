const Block = require('./Block');
const crypto = require('./hash');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {

    if (data == null || data === "" || (Object.keys(data).length === 0 && data.constructor === Object)) {
      throw new Error("Data must be provided to add a block");
    }

    const addedBlock = Block.mineBlock({ lastBlock: this.chain.at(-1), data });
    this.chain.push(addedBlock);
    return addedBlock;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.isValid(chain)) return;

    this.chain = chain;
  }

  static isValid(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, data, hash, lastHash } = chain.at(i);
      const prevHash = chain[i - 1].hash;

      if (lastHash !== prevHash) return false;

      const validHash = crypto(timestamp, data, lastHash);
      if (hash !== validHash) return false;
    }

    return true;
  }
}

module.exports = Blockchain;
