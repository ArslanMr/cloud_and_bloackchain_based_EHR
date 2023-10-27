const Surgeries = artifacts.require("Surgeries");

module.exports = function(deployer) {
  deployer.deploy(Surgeries);
};
