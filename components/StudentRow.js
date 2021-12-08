import React, { Component } from 'react';
import { Message, Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import School from '../ethereum/school';
//import tlink from '../ethereum/tlink';
import { Router } from '../routes';

class StudentRow extends Component {
  state = {
    loading: false,
    errorMessage: '',
    buttonText: 'Check Grade',
    grade: ''
  }

  getGrade = async () => {
    const school = School(this.props.address);
    const studentGrade = await school.methods.grade().call();
    this.setState({ grade: studentGrade });
    this.setState({ buttonText: this.state.grade });
    this.setState({ loading: false });
  }  
  
  onApprove = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });
    try {
      const school = School(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await school.methods.getGrade().send({
	from: accounts[0]
      });
      setTimeout(this.getGrade, 20000);
    }
    catch (err) {
      this.setState({ errorMessage: err.message, loading: false });
      
    }
    //this.setState({ loading: false });
  }
  
  onFinalize = async (event) => {
    event.preventDefault()
    this.setState({ loading: true, errorMessage: '' });
    try {
      const school = School(this.props.address);
      const studentGrade = await school.methods.grade().call();
      const accounts = await web3.eth.getAccounts();
      await school.methods.sendReward(this.props.id, studentGrade).send({
	from: accounts[0],
	value: this.props.student.value
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
	<Cell>{student.name}</Cell>
	<Cell>{web3.utils.fromWei(student.value, 'ether')}</Cell>
	<Cell>{student.addr}</Cell>
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

export default StudentRow;
