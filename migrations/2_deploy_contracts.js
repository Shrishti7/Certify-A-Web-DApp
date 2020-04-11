const Certify = artifacts.require("Certify");

module.exports = function(deployer) {
  deployer.deploy(Certify);
};
