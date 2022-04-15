const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {teachers: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/teachers'}).done(response => {
			this.setState({teachers: response.entity._embedded.teachers});
		});
	}

	render() { (3)
		return (
			<TeacherList teachers={this.state.teachers}/>
		)
	}
}

class TeacherList extends React.Component{
	render() {
		const teachers = this.props.teachers.map(teacher =>
			<Teacher key={teacher._links.self.href} teacher={teacher}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Phone Number</th>
					</tr>
					{teachers}
				</tbody>
			</table>
		)
	}
}

class Teacher extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.teacher.firstName}</td>
				<td>{this.props.teacher.lastName}</td>
				<td>{this.props.teacher.email}</td>
				<td>{this.props.teacher.phoneNumber}</td>
			</tr>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)