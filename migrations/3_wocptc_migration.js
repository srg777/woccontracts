const WOCPTC = artifacts.require("WOCPTC");

module.exports = async function (deployer) {
  await deployer.deploy(WOCPTC);
  let token = await WOCPTC.deployed();
};
