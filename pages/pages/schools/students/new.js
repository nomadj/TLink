import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import School from '../../../ethereum/school';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
//import tlink from '../../../ethereum/tlink';

class StudentNew extends Component {

  state = {
    name: '',
    value: '',
    recipient: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const school = School(this.props.address);
    //const { name, value, recipient } = this.state;
    const { name, value } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      // await school.methods.createStudent(
      //   name,
      //   web3.utils.toWei(value, 'ether'),
      //   recipient
      // ).send({ from: accounts[0] });

      await school.methods.addStudent(
        name,
        web3.utils.toWei(value, 'ether')
      ).send({ from: accounts[0] });

      Router.pushRoute(`/schools/${this.props.address}/students`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false })
  };

  render() {
    return (
      <Layout>
        <Link route={`/schools/${this.props.address}/students`}>
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
