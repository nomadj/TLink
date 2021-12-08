import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class SchoolIndex extends Component {
  static async getInitialProps() {
    const schools = await factory.methods.getDeployedSchools().call();

    return { schools };
  }

  renderSchools() {
    const items = this.props.schools.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/schools/${address}`}>
            <a>View School</a>
          </Link>
        ),
        fluid: true // stretches across screen
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Schools</h3>
          <Link route="/schools/new">
            <a>
              <Button
                floated="right"
                content="Add School"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderSchools()}
        </div>
      </Layout>
    );
  };
};

export default SchoolIndex;
