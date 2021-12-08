import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import School from '../../ethereum/school';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class SchoolShow extends Component {
  static async getInitialProps(props) {
    const school = School(props.query.address);

    const summary = await school.methods.getSummary().call();

    return {
      address: props.query.address,
      //minimumContribution: summary[0],
      //balance: summary[1],
      studentsCount: summary[0],
      //approversCount: summary[3],
      manager: summary[1]
    };
  }

  renderCards() {
    const {
      //balance,
      manager,
      //minimumContribution,
      studentsCount,
      //approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Principal Address',
        style: { overflowWrap: 'break-word' }
      },
      // {
      //   header: minimumContribution,
      //   meta: 'Minimum Contribution (wei)',
      //   description: 'You must contribute at least this much wei to become a contributor'
      // },
      {
        header: studentsCount,
        meta: 'Number of Students'
      }
      // {
      //   header: approversCount,
      //   meta: 'Number of Approvers',
      //   description: 'Number of people who have already donated to this school'
      // },
      // {
      //   header: web3.utils.fromWei(balance, 'ether'),
      //   meta: 'School Balance (ether)',
      //   description: 'The balance is how much money this school has left to spend'
      // }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>School Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/schools/${this.props.address}/students`}>
              <a>
                <Button primary>View Students</Button>
              </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default SchoolShow;
