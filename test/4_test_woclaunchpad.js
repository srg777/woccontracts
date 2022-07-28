//dont forget $npm install truffle-assertions
const truffleAssert = require("truffle-assertions");
const WOCPAD = artifacts.require("WOCPAD");
const WOCPTC = artifacts.require("WOCPTC");


contract("WOCPAD", (accounts) => {


  describe("Deposit", () =>  {
  
    it("WOCPAD balance in PTC should be zero", async () => {
      let token = await WOCPTC.deployed();
      let pad = await WOCPAD.deployed();
      let balance = await token.balanceOf(pad.address);

      assert.equal(balance, 0);
    });

    it("after deposit() balance shoul be equal dmax", async () => {
      let token = await WOCPTC.deployed();
      let pad = await WOCPAD.deployed();

      const dmax=await pad.getdmax();

      // const dmax =web3.utils.toWei('10');

      await token.approve(pad.address, dmax, {from: accounts[0]});
      await pad.deposit({from: accounts[0]});
      const balance = await token.balanceOf(pad.address);

      assert.equal(balance.toString(), dmax.toString());
    });

  });

});


// assert.equal(owner, accounts[0]);
    // await truffleAssert.passes(
      //   token.transferOwnership(accounts[0], {
      //     from: accounts[2],
      //   })