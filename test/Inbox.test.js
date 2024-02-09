const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const INITIAL_MESSAGE = "Hi there!";

beforeEach(async () => {
    // List of ganache local test accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy a contract
    // interface === ABI
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
    it("deploys a contract", () => {
        // asserts the contract address is a truthy value
        assert.ok(inbox.options.address);
    });

    it("contract is created with an initial message", async () => {
        const message = await inbox.methods.message().call();

        assert.equal(message, INITIAL_MESSAGE);
    });

    it("can change the message", async () => {
        // This will throw and test will fail if something goes wrong
        await inbox.methods
            .setMessage("Bye there!")
            .send({ from: accounts[0] });

        const message = await inbox.methods.message().call();

        assert.equal(message, "Bye there!");
    });
});
