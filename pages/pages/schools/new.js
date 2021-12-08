import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class SchoolNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createSchool(web3.utils.toWei(this.state.minimumContribution))
        .send({
          from: accounts[0]
      })
      Router.pushRoute('/');
    } catch (err) {
        this.setState({ errorMessage: err.message })
      };
      this.setState({ loading: false })
  };

  render() {
    return (
      <Layout>
        <h3>Add a School</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Donor Contribution</label>
            <Input
              label='eth'
              labelPosition='right'
              value={this.state.minimumContribution}
              onChange={event => this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button type='submit' primary loading={this.state.loading}>Add</Button>
        </Form>
      </Layout>
    );
  };
};

export default SchoolNew;
