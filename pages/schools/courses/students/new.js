import React, { Component } from 'react';
import Layout from '../../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import School from '../../../../ethereum/school';
import web3 from '../../../../ethereum/web3';
import { Link, Router } from '../../../../routes';

class StudentNew extends Component {

  state = {
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address, courseName } = props.query;
    const school = School(address);
    const courseID = await school.methods.courseNameToID(courseName).call();
    console.log(`The courseID is: ${courseID}`);
    const course = await school.methods.courses(courseID).call();
    const tuition = course.tuition;
    console.log(courseName);
    console.log(`The course is: ${course.name}`);
    
    return { address, school, courseName, tuition };
  }

  onEnroll = async () => {
    const { courseName, tuition, school } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const accounts = await web3.eth.getAccounts();
      await school.methods.courseEnroll(courseName).send({
	from: accounts[0],
	value: tuition
      });
      Router.push(`/schools/${this.props.address}/courses/${this.props.courseName}/students`);
    }
    catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(this.state.errorMessage);
    }
    this.setState({ loading: false });
  }

  // onSubmit = async (event) => {
  //   event.preventDefault();

  //   const school = School(this.props.address);
  //   //const { name, value, recipient } = this.state;
  //   const { name, value } = this.state;

  //   this.setState({ loading: true, errorMessage: '' });

  //   try {
  //     const accounts = await web3.eth.getAccounts();
  //     // await school.methods.createStudent(
  //     //   name,
  //     //   web3.utils.toWei(value, 'ether'),
  //     //   recipient
  //     // ).send({ from: accounts[0] });

  //     await school.methods.schoolEnroll(
  //       name,
  //       web3.utils.toWei(value, 'ether')
  //     ).send({ from: accounts[0] });

  //     Router.pushRoute(`/schools/${this.props.address}/students`);
  //   } catch (err) {
  //     this.setState({ errorMessage: err.message });
  //   }

  //   this.setState({ loading: false })
  // };

  render() {
    return (
      <Layout>
        <Link route={`/schools/${address}/courses/${this.props.courseName}`}>
          <a>Back</a>
        </Link>
        <h3>Add a Student</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value})}
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>Add</Button>

        </Form>
      </Layout>
    );
  }
}

export default StudentNew;
