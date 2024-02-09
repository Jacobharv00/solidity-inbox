const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { interface, bytecode } = require("./compile");
const keys = require("./fake-keys");

const provider = new HDWalletProvider(
    keys,
    "https://sepolia.infura.io/v3/5294f5fc776d4402aca4de8fd2db4c41"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ["Hi there!"] })
        .send({ gas: "1000000", from: accounts[0] });

    console.log("Contract deployed to -->", result.options.address);

    // To prevent hanging deployment
    provider.engine.stop();
};

deploy();
