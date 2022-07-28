const WOCPAD = artifacts.require("WOCPAD");
const ERC20 = artifacts.require("./openzeppelin/ERC20");
const WOCPTC = artifacts.require("WOCPTC");

module.exports = async function (deployer) {
  let testerc = await ERC20.deployed();
  let wocptc = await WOCPTC.deployed();

  await deployer.deploy(
    WOCPAD,
    testerc.address,
    wocptc.address,
    web3.utils.toWei("1"),
    web3.utils.toWei("3"),
    web3.utils.toWei("10")
  );
  let woclpad = await WOCPAD.deployed();
};
