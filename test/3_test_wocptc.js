/**
 * Very useful link for preparing test scripts
 *
 * https://betterprogramming.pub/a-few-tips-for-unit-testing-ethereum-smart-contract-in-solidity-d804062068fb
 *
 */

//dont forget $npm install truffle-assertions
const truffleAssert = require("truffle-assertions");
const WOCPTC = artifacts.require("WOCPTC");

contract.skip("WOCPTC", (accounts) => {
  describe("ERC20 features", () => {
    it("Should have 'name' and 'symbol' and have '18' for the decimals.", async () => {
      let token = await WOCPTC.deployed();
      let name = await token.name();
      let symbol = await token.symbol();
      let decimals = await token.decimals();

      assert.equal(name, "WOC Platinum Coin");
      assert.equal(symbol, "WOCPTC");
      assert.equal(decimals, 18);
    });
  });

  describe("Ownable", () => {
    it("should have creator as the owner", async () => {
      let token = await WOCPTC.deployed();
      let owner = await token.owner();

      assert.equal(owner, accounts[0]);
    });

    it("shouldn't call onlyOwner feature with no-owner caller", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.reverts(
        token.transferOwnership(accounts[2], { from: accounts[1] })
      );
    });

    it("should be able to transwer ownership", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.passes(token.transferOwnership(accounts[2]));
      let owner = await token.owner();
      assert.equal(owner, accounts[2]);
      await truffleAssert.passes(
        token.transferOwnership(accounts[0], {
          from: accounts[2],
        })
      );
    });
    // dangerous test - makes impossible other onlyOwner tests
    // it("shouldn't call onlyOwner feature after renounceOwnership", async () => {
    //   let token = await WOCPTC.deployed();

    //   await token.renounceOwnership({ from: accounts[2] });
    //   await truffleAssert.reverts(
    //     token.transferOwnership(accounts[0], { from: accounts[2] })
    //   );
    // });
  });

  describe("Pausable", () => {
    it("should be not paused after creation", async () => {
      let token = await WOCPTC.deployed();
      let paused = await token.paused();

      assert.equal(paused, false);
    });

    it("only Owner could change paused state", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.reverts(token.setPause(true, { from: accounts[1] }));
    });

    it("could change paused state", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.passes(token.setPause(true));
      paused = await token.paused();
      assert.equal(paused, true);
      await truffleAssert.passes(token.setPause(false));
    });

    it("couldn't call whenNotPausedcfunction while current state is Not Pased", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.reverts(token.setPause(false));
    });

    it("couldn't transfer when Paused", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.passes(token.transfer(accounts[1], 1000));
      await truffleAssert.passes(token.setPause(true));
      await truffleAssert.reverts(token.transfer(accounts[1], 1000));
      await truffleAssert.passes(token.setPause(false));
    });
  });

  describe("Mintabe", () => {
    it("Not owner couldn't mint", async () => {
      let token = await WOCPTC.deployed();
      await truffleAssert.reverts(
        token.mint(accounts[1], 10000, { from: accounts[1] })
      );
    });

    it("owner could mint", async () => {
      let token = await WOCPTC.deployed();
      let oldSupply = await token.totalSupply();
      await truffleAssert.passes(token.mint(accounts[1], 10000));
      let newSupply = await token.totalSupply();
      let delta = newSupply.sub(oldSupply);
      assert.equal(delta.toString(), web3.utils.toBN(10000).toString());
    });
  });

  describe("Burnable", () => {
    it("Can burn own coins", async () => {
      let token = await WOCPTC.deployed();
      let oldSupply = await token.totalSupply();
      await truffleAssert.passes(token.burn(10000));
      let newSupply = await token.totalSupply();
      let delta = oldSupply.sub(newSupply);
      assert.equal(delta.toString(), web3.utils.toBN(10000).toString());
    });

    it("Can't burn not allowed coins", async () => {
      let token = await WOCPTC.deployed();
      await token.transfer(accounts[1], 1000);
      await truffleAssert.reverts(token.burnFrom(accounts[1], 1000));
    });

    it("Can burn allowed coins", async () => {
      let token = await WOCPTC.deployed();
      await token.transfer(accounts[1], 1000);
      await token.approve(accounts[0], 1000, { from: accounts[1] });
      await truffleAssert.passes(token.burnFrom(accounts[1], 1000));
    });
  });
  //   it("", async () => {});
  //   it("Should have ZERO supply, not be paused, and set ZERO balances for all accounts at initial state.", async () => {});
  //   it("Can mint tokens increasing the owners balance and total supply as much", async () => {});
  //   it("Can mint token only by minters(accounts granted minter role).", async () => {});
  //   it("Can transfer decreasing sender's balance and increasing recipient's balance as much.", async () => {});
  //   it("Should not change balances of irrelative accounts(neither sender nor recipient).", async () => {});
});
