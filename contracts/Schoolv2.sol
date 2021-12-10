// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract SchoolFactory {
	School[] public deployedSchools;

	function createSchool(uint minimum) public {
		School newSchool = new School(minimum, msg.sender);
		deployedSchools.push(newSchool);
	}

	function getDeployedSchools() public view returns (School[] memory) {
		return deployedSchools;
	}
}

contract School is ChainlinkClient {
	using Chainlink for Chainlink.Request;

	address public manager;
	uint256 public grade;
	uint256 public studentCount;
	uint256 public courseCount;
	uint256 public studentID;
	uint256 public courseID;
	mapping (address => bool) public isEnrolled;
	mapping (uint => Student) public students;
	mapping (uint => Course) public courses;
	uint public minimumContribution;
	mapping(address => bool) public approvers;
	uint public approversCount;
	uint256 public gradeThreshold;
	address private oracle;
	bytes32 private jobId;
	uint256 private fee;

	modifier restricted() {
		require(msg.sender == manager);
		_;
	}

	constructor(uint minimum, address creator) {
		manager = creator;
		minimumContribution = minimum;
		setPublicChainlinkToken();
		oracle = 0x3f18E5AD67EDBbcB525F5613c5a687d3AB5A898A;
		jobId = "9fe161b8c45f4154aa25efe4ee703500";
		fee = 0.1 * 10 ** 18;
	}

	struct Student {
		string name;
		uint id;
		uint value;
		address addr;
		uint currentCourseCount;
		mapping (uint => string) currentCourses;
		mapping (uint => string) completedCourses;
		mapping (uint => uint) reportCard;
	}

	struct Course {
		string name;
		uint id;
		string description;
		uint enrollment;
		mapping (address => string) students;
		uint tuition;
 	}

	function contribute() public payable {
		require(msg.value > minimumContribution);

		approvers[msg.sender] = true;
		approversCount++;
	}

	/* function addStudent(string name, uint value, address recipient) public { */
	/* 	Student memory newStudent = Student({ */
	/* 		name: name, */
	/* 		value: value, */
	/* 		recipient: recipient, */
	/* 		passing: false */
	/* 	}); */

	/* 	students.push(newStudent); */
	/* } */

	function addStudent(string memory name, uint value) public {
		require(!isEnrolled[msg.sender]);
		studentID = studentCount++;
		Student storage newStudent = students[studentID];
		newStudent.name = name;
		//newStudent.id = studentID;
		newStudent.id = studentCount;
		newStudent.value = value;
		newStudent.addr = payable(msg.sender);
		//		addrToName[msg.sender] = name;
		isEnrolled[msg.sender] = true;
	}

	function addCourse(string memory name, string memory description, uint tuition) public restricted {
		courseID = courseCount++;
		//Course storage newCourse = courses[courseID];
		Course storage newCourse = courses[courseID];
		newCourse.name = name;
		newCourse.id = courseID;
		newCourse.description = description;
		newCourse.tuition = tuition;
		newCourse.enrollment = 0;
	}

	function enroll(uint courseIndex, uint studentIndex) public payable {
		Course storage course = courses[courseIndex];
		Student storage student = students[studentIndex];
		course.students[msg.sender] = student.name;
		course.enrollment++;
		student.reportCard[course.id] = 0;
		student.currentCourseCount++;
		student.currentCourses[course.id] = course.name;
		payable(manager).transfer(msg.value);
	}

	function getGrade(uint courseIndex, uint studentIndex) public returns (bytes32 requestId) {
		Course storage course = courses[courseIndex];
		Student storage student = students[studentIndex];
		Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
		request.add("get", "https://ipfs.io/ipfs/QmZ19vAtuEBf24p6w8ojcsriLeV2bF8cNX65aTQVQBPrnv");
		string[] memory path = new string[](5);
		path[0] = "students";
		path[1] = student.name;
		path[2] = "classes";
		path[3] = course.name;
		path[4] = "grade";
		request.addStringArray("path", path);

		int timesAmount = 10**18;
		request.addInt("times", timesAmount);

		return sendChainlinkRequestTo(oracle, request, fee);
	}

	function fulfill(bytes32 _requestId, uint256 _grade) public recordChainlinkFulfillment(_requestId) {
		grade = _grade;
	}
	
	function sendReward(uint index, uint256 studentGrade) public payable {
		gradeThreshold = 80;
		require(studentGrade >= gradeThreshold);
		Student storage student = students[index];
		payable(student.addr).transfer(msg.value);
	}

	/* function getSummary() public view returns (uint, address) { */
	/* 	return (schoolEnrollment, manager); */
	/* } */

	function schoolSummary() public view returns (uint, address) {
		return (studentCount, manager);
	}

	function coursesSummary() public view returns (uint, address) {
		return (courseCount, manager);
	}

	function getStudentsCount() public view returns (uint) {
		return studentCount;
	}
}
