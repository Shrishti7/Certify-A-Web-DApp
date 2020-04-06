pragma solidity ^0.5.0;

contract Certificate {
  string public certHash = "";
  uint public globalCertCount = 0;


  struct certificate{
    uint certCount;
    string uid;
    string certHash;
  }

  mapping(uint => certificate) public certificates;

  event store(
    uint certCount,
    string uid,
    string certHash
  );


  constructor() public {
    //Register("Shrishti","shrishtig797@gmail.com");
  }

  function Upload(string memory _uid, string memory _certHash) public {

    //Check if uid and certHash are empty
    require(bytes(_uid).length >0 );
    require(bytes(_certHash).length >0 );

    //Increase globalCertCount
    globalCertCount ++;

    //Create event
    certificates[globalCertCount] = certificate(globalCertCount, _uid, _certHash);

    //Trigger event
    emit store(globalCertCount, _uid, _certHash);

  }

  /* function get() public view returns (string memory) {
    return certHash;
  } */
}
