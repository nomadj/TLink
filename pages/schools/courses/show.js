import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import School from '../../../ethereum/school';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../../components/ContributeForm';
import { Link, Router } from '../../../routes';

class CourseShow extends Component {
  state = {
    loading: false,
    errorMessage: ''
  }
  static async getInitialProps(props) {
    const school = School(props.query.address);
    const courseName = props.query.courseName;
    const courseID = await school.methods.courseNameToID(courseName).call();
    const course = await school.methods.courses(courseID).call();
    return {
      school: school,
      address: props.query.address,
      course: course,
      courseName: courseName,
      manager: course.teacher,
      studentCount: course.enrollment,
      description: course.description,
      tuition: course.tuition
    };
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

  renderCards() {
    const {
      manager,
      courseName,
      studentCount,
      description,
      tuition
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Teacher Address',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: studentCount,
        meta: 'Enrollment'
      },
      {
	header: courseName,
	meta: 'Course Name'
      },
      {
	header: description,
	meta: 'Description'
      },
      {
	header: `${web3.utils.fromWei(tuition, 'ether')} eth`,
	meta: 'Tuition'
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
        <h3>Course Details</h3>
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
	      <Link route={`/schools/${this.props.address}/courses/${this.props.courseName}/students`}>
		<a>
		  <Button primary>
		    View Students
		  </Button>
		</a>
	      </Link>
	      <a>
		<Button primary onClick={this.onEnroll} loading={this.state.loading}>
		  Enroll
		</Button>
	      </a>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CourseShow;
