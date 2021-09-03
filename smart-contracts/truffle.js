const HDWalletProvider = require("truffle-hdwallet-provider");

const INFURA_KEY = "2c2263ecf06f41c58d6c4bad88793dfc";
const MNEMONIC = "proof grant leave unusual hurdle world clump cruel action final excess culture";

module.exports = {
  compilers: {
    solc: {
      version: ">0.4.24", // A version or constraint - Ex. "^0.5.0"
                         // Can also be set to "native" to use a native solc
      }
    },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      network_id: 4,
      provider: function() {
        return new HDWalletProvider(
          "https://rinkeby.infura.io/v3/" + INFURA_KEY,
          MNEMONIC,
        )
      },
    },
  }
};
