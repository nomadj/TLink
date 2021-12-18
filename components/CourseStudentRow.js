import React, { Component } from 'react';
import { Message, Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import School from '../ethereum/school';
//import tlink from '../ethereum/tlink';
import { Router } from '../routes';

class CourseStudentRow extends Component {
  state = {
    loading: false,
    errorMessage: '',
    buttonText: 'Check Grade',
    grade: ''
  }

  getGrade = async () => {
    const school = School(this.props.address);
    const accounts = await web3.eth.getAccounts();
    const grade = await school.methods.grade().call();
    await school.methods.getGrade(this.props.courseName).send({
      from: accounts[0]
    });
    console.log(`The grade is: ${grade}`);
    this.setState({ grade: grade });
    this.setState({ buttonText: this.state.grade });
    this.setState({ loading: false });
  }  
  
  onApprove = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const school = School(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await school.methods.linkReq(this.props.courseName, this.props.id).send({
	from: accounts[0]
      });
      setTimeout(this.getGrade, 30000);
    }
    catch (err) {
      this.setState({ errorMessage: err.message, loading: false });
      console.log(this.state.errorMessage);
      console.log(this.props.courseName);
    }
    //this.setState({ loading: false });
  }
  
  onFinalize = async () => {
    console.log(`The student value is ${this.props.studentValue}`);
    this.setState({ loading: true, errorMessage: '' });
    try {
      const school = School(this.props.address);
      const studentGrade = await school.methods.structGrade().call();
      const accounts = await web3.eth.getAccounts();
      await school.methods.sendReward(this.props.id, studentGrade).send({
	from: accounts[0],
	value: this.props.studentValue
      });
      Router.push(`/schools/${this.props.address}`);
      
    }
    catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, student } = this.props;
    return (
      <Row>
	<Cell>{id}</Cell>
	<Cell>{student}</Cell>
	<Cell>
	  <Button color="green" basic onClick={this.onApprove} loading={this.state.loading}>
	    {this.state.buttonText}
	  </Button>
	  <Button color="teal" basic onClick={this.onFinalize} loading={this.state.loading}>
	    $
	  </Button>
	</Cell>
      </Row>
    );
  }
}

export default CourseStudentRow;
