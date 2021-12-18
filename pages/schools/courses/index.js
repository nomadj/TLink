import React, { Component } from 'react';
import School from '../../../ethereum/school';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

class CourseIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const { courseName } = props.query;
    const school = School(address);
    const courseCount = await school.methods.courseCount().call();
    const courses = await Promise.all(
      Array(parseInt(courseCount)).fill().map((element, index) => {
        return school.methods.courses(index).call();
      })
    );
    console.log(`The courseCount is: ${courseCount}`);

    return { courses, address, courseName };
  }

  renderCourses() {
    const items = this.props.courses.map(course => {
      return {
        header: course.name,
        description: (
          <Link route={`/schools/${this.props.address}/courses/${course.name}`}>
            <a>View Course</a>
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
          <h3>Course Offerings</h3>
          <Link route={`/schools/${this.props.address}/courses/new`}>
            <a>
              <Button
                floated="right"
                content="Add Course"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderCourses()}
        </div>
      </Layout>
    );
  };
};

export default CourseIndex;
