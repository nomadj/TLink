// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract TLink is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public grade;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    mapping(address => bool) private parentAddressToBool;
    mapping(address => string) public parentAddressToName;

    constructor() {
        setPublicChainlinkToken();
        oracle = 0x3f18E5AD67EDBbcB525F5613c5a687d3AB5A898A;
        jobId = "9fe161b8c45f4154aa25efe4ee703500";
        fee = 0.1 * 10 ** 18;
    }

    /* function addStudent(string memory name) public { */
    /*     require(!parentAddressToBool[msg.sender]); */
    /*     parentAddressToName[msg.sender] = name; */
    /*     parentAddressToBool[msg.sender] = true; */
    /* } */

    function getGrade(string memory class, string memory student) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", "https://ipfs.io/ipfs/QmYhzJjiod4oFq5vMteq7NCwsj8ptXz4n9GPvi2bfXbgeV");
        string[] memory path = new string[](5);
        path[0] = "students";
        path[1] = student;
        path[2] = "classes";
        path[3] = class;
        path[4] = "grade";
        request.addStringArray("path", path);

        int timesAmount = 10**18;
        request.addInt("times", timesAmount);

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /* function resetGrade() public { */

    /* } */

    function fulfill(bytes32 _requestId, uint256 _grade) public recordChainlinkFulfillment(_requestId) {
        grade = _grade;
    }

		// ************************
		// **********TODO**********
		// ************************
    // function withdrawLink() external {}
}
