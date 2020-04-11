pragma solidity ^0.5.0;

contract Certify {
    uint public registrationCount = 0;
    uint public globalCertCount = 0;
    uint public companyCertCount = 0;

    struct Student{
      uint id;
      string profile;
      string uid;
      string name;
      string email;
      address wallet;
    }

    mapping(uint => Student) public students;

    event register(
      uint id,
      string profile,
      string uid,
      string name,
      string email,
      address wallet
    );

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

    struct company{
      uint count;
      string suid;
      string cuid;
      string compCertHash;
    }

    mapping(uint => company) public companyCert;

    event sendCert (
      uint count,
      string suid,
      string cuid,
      string compCertHash
    );


    constructor() public {
      //Register("Shrishti","shrishtig797@gmail.com");
    }

    function Register(string memory _profile, string memory _uid,string memory _name, string memory _email) public {

          //Check if name and email are empty
          require(bytes(_profile).length >0 );
          require(bytes(_uid).length >0 );
          require(bytes(_name).length >0 );
          require(bytes(_email).length >0 );

          //Increase Registration Count
          registrationCount ++;

          //Create Event
          students[registrationCount] = Student(registrationCount, _profile, _uid, _name, _email, msg.sender);

          //Trigger Event
          emit register(registrationCount, _profile, _uid, _name, _email, msg.sender);
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

    function Send(string memory _cuid, string memory _suid, string memory _compCertHash) public {
      //Check if uid and certHash are empty
      require(bytes(_cuid).length >0 );
      require(bytes(_suid).length >0 );
      require(bytes(_compCertHash).length >0 );

      //Increase globalCertCount
      companyCertCount ++;

      //Create event
      companyCert[companyCertCount] = company(companyCertCount, _cuid, _suid, _compCertHash);

      //Trigger event
      emit sendCert(companyCertCount, _cuid, _suid, _compCertHash);
    }

}
