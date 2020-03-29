const Certify = artifacts.require("Certify");
const Certificate = artifacts.require("Certificate");

module.exports = function(deployer) {
  deployer.deploy(Certify);
  deployer.deploy(Certificate);
};
