import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Message, Form, Input, Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import School from '../../../ethereum/school';
import StudentRow from '../../../components/StudentRow';

class StudentIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const school = School(address);
    const studentCount = await school.methods.schoolEnrollment().call();
    //const approversCount = await school.methods.approversCount().call();
    // const students = await Promise.all(
    //   Array(parseInt(studentCount)).fill().map((element, index) => {
    //     return school.methods.students(index).call();
    //   })
    // );

    const students = await Promise.all(
      Array(parseInt(studentCount)).fill().map((element, index) => {
        return school.methods.students(index).call();
      })
    );

    return { address, students, studentCount };
  }

  renderRows() {
    return this.props.students.map((student, index) => {
      return (
        <StudentRow
          key={index}
          id={index}
          student={student}
          address={this.props.address}
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
        <h3>Students</h3>
        <Link route={`/schools/${this.props.address}/students/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add Student</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Address</HeaderCell>
              <HeaderCell>Approval</HeaderCell>
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
