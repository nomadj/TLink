import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import School from '../../../ethereum/school';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

class CourseNew extends Component {

  state = {
    name: '',
    description: '',
    tuition: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address } ;
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const school = School(this.props.address);
    const { name, description, tuition } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      // await school.methods.createStudent(
      //   name,
      //   web3.utils.toWei(value, 'ether'),
      //   recipient
      // ).send({ from: accounts[0] });

      await school.methods.addCourse(
        name,
	description,
        web3.utils.toWei(tuition, 'ether')
      ).send({ from: accounts[0] });

      Router.pushRoute(`/schools/${this.props.address}/courses`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false })
  };

  render() {
    return (
      <Layout>
        <Link route={`/schools/${this.props.address}/courses`}>
          <a>Back</a>
        </Link>
        <h3>Add a Course</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value})}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event => this.setState({ description: event.target.value })}
            />
          </Form.Field>
	  
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.tuition}
              onChange={event => this.setState({ tuition: event.target.value })}
            />
          </Form.Field>	  

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>Add</Button>

        </Form>
      </Layout>
    );
  }
}

export default CourseNew;
