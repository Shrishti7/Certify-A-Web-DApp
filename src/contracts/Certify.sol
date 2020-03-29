pragma solidity ^0.5.0;

contract Certify {
    uint public registrationCount = 0;

    struct Student{
      uint id;
      string uid;
      string profile;
      string name;
      string email;
      address wallet;
    }

    mapping(uint => Student) public students;

    event register(
      uint id,
      string uid,
      string profile,
      string name,
      string email,
      address wallet
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

}
