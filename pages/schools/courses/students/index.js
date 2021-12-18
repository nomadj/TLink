import React, { Component } from 'react';
import Layout from '../../../../components/Layout';
import { Message, Form, Input, Button, Table } from 'semantic-ui-react';
import { Link } from '../../../../routes';
import School from '../../../../ethereum/school';
import CourseStudentRow from '../../../../components/CourseStudentRow';
import web3 from '../../../../ethereum/web3';

class StudentIndex extends Component {
  static async getInitialProps(props) {
    const { address, courseName } = props.query;
    const school = School(address);
    const courseID = await school.methods.courseNameToID(courseName).call();
    console.log(`The courseID is: ${courseID}`);
    const course = await school.methods.courses(courseID).call();
    console.log(`Course Struct: ${course}`);
    const studentCount = course.enrollment;
    console.log(`studentCount is: ${studentCount}`);
    //const approversCount = await school.methods.approversCount().call();
    // const students = await Promise.all(
    //   Array(parseInt(studentCount)).fill().map((element, index) => {
    //     return school.methods.students(index).call();
    //   })
    // );
    // const students = await Promise.all(
    //   Array(parseInt(studentCount)).fill().map(element => {
    //     return school.methods.getCourseStudents(courseName).call();
    //   })
    // );

    const students = await school.methods.getCourseStudents(courseName).call();
    console.log(`Here are the students: ${students}`);
    const studentObj = await school.methods.getStudentObj().call();
    const studentValue = studentObj.value;
    const tuition = course.tuition;

    return { school, address, studentValue, tuition, students, studentCount, course, courseName };
  }

  state = {
    loading: false,
    errorMessage: ''
  }

  onEnroll = async () => {
    const { courseName, tuition, school, address } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const accounts = await web3.eth.getAccounts();
      await school.methods.courseEnroll(courseName).send({
	from: accounts[0],
	value: tuition
      });
      Router.push(`/schools/${address}/courses/${courseName}/students`);
    }
    catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(this.state.errorMessage);
    }
    this.setState({ loading: false });
  }  
  
  renderRows() {
    console.log(`The courseName is:${this.props.courseName}`);
    return this.props.students.map((student, index) => {
      return (
        <CourseStudentRow
          key={index}
          id={index}
          student={student}
          address={this.props.address}
	  courseName={this.props.courseName}
	  studentValue={this.props.studentValue}
        />
      );
    });
  }

  // renderForm() {
  //   return (<InputClassForm/>);
  // }
  
  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>{this.props.courseName} students</h3>
        <a>
          <Button primary
		  floated="right"
		  style={{ marginBottom: 10 }}
		  onClick={this.onEnroll}
		  loading={this.state.loading}
	  >
	    Enroll
	  </Button>
        </a>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Address</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>{this.props.studentCount} students enrolled</div>
      </Layout>
    );
  }
}

export default StudentIndex;
