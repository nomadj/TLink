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
	mapping (address => uint256) public grades;
	uint256 public schoolEnrollment;
	uint256 public studentID;
	uint256 public courseCount;
	uint256 public courseID;
	uint256 public structGrade;
	mapping (uint => Student) public students;
	mapping (string => uint) public studentNameToID;
	mapping (address => uint) public studentAddressToID;
	mapping (uint => Course) public courses;
	mapping (string => uint) public courseNameToID;
	mapping (address => bool) public isEnrolled;
	uint public minimumContribution;
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
		string[] currentCourses;
		string[] completedCourses;
		uint currentCourseCount;
		uint grade;
	}

	struct Course {
		string name;
		uint id;
		address teacher;
		string description;
		uint enrollment;
		address[] students;
		uint tuition;
		mapping (address => uint) grades;
 	}

	function schoolEnroll(string memory name, uint value) public {
		require(!isEnrolled[msg.sender]);
		studentID = schoolEnrollment++;
		Student storage student = students[studentID];
		studentAddressToID[msg.sender] = studentID;
		studentNameToID[name] = studentID;
		student.name = name;
		student.id = studentID;
		student.value = value;
		student.addr = msg.sender;
		student.currentCourseCount = 0;
		isEnrolled[msg.sender] = true;
	}

	function addCourse(string memory name, string memory description, uint tuition) public restricted {
		courseID = courseCount++;
		Course storage course = courses[courseID];
		courseNameToID[name] = courseID;
		course.name = name;
		course.id = courseID;
		course.teacher = msg.sender;
		course.description = description;
		course.tuition = tuition;
		course.enrollment = 0;
	}

	function courseEnroll(string memory courseName) public payable {
		Course storage course = courses[courseNameToID[courseName]];
		Student storage student = students[studentAddressToID[msg.sender]];
		student.currentCourses.push(course.name);
		student.currentCourseCount = student.currentCourses.length;
		course.students.push(msg.sender);
		student.currentCourses[student.currentCourseCount -1] = course.name;
		course.enrollment++;
		payable(manager).transfer(msg.value);
	}

	function getCourseStudents(string memory courseName) public view returns (address[] memory) {
		Course storage course = courses[courseNameToID[courseName]];
		return course.students;
	}

	function getStudentObj() public view returns (Student memory) {
		Student storage student = students[studentAddressToID[msg.sender]];
		return student;
	}

	function linkReq(string memory courseName, uint index) public returns (bytes32 requestId) {
		Course storage course = courses[courseNameToID[courseName]];
		Student storage student = students[studentAddressToID[course.students[index]]];
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
		grades[msg.sender] = grade;
	}

	function getGrade(string memory courseName) public returns (uint256) {
		Course storage course = courses[courseNameToID[courseName]];
		course.grades[msg.sender] = grade;
		Course storage updatedCourse = courses[courseNameToID[courseName]];
		structGrade = updatedCourse.grades[msg.sender];
		return structGrade;
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
		return (schoolEnrollment, manager);
	}

	/* function courseSummary() public view returns () { */
		
	/* 	return (courseCount, manager); */
	/* } */

	function getStudentsCount() public view returns (uint) {
		return studentID;
	}
}
