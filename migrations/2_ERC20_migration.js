const ERC20 = artifacts.require("./openzeppelin/ERC20");

module.exports = async function (deployer) {
  await deployer.deploy(ERC20, "tUSD", "tUSD");
  let erc20 = await ERC20.deployed();
};
