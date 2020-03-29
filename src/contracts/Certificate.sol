pragma solidity ^0.5.0;

contract Certificate {
  string certHash;

  function set(string memory _certHash) public {
    certHash = _certHash;
  }

  function get() public view returns (string memory) {
    return certHash;
  }
}
