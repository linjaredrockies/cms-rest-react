const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
import { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyModalComponent from './components/bootstrap-modal.component';

const traverse = require('./traverse'); // function to hop multiple links by "rel"

const root = '/api';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			teachers: [], attributes: [], pageSize: 2, links: {},
			dialog: {
				show: false,
				title: 'Create a teacher',
				body: '',
				data: []
			}
		};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}

	render() {
		this.state.dialog.data = this.state.attributes;
		return (
			<div>
				<h4 style={{textAlign: 'center'}}>Teachers</h4>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} dialogState={this.state.dialog} />
				<br></br>
				<TeacherList teachers={this.state.teachers}
					links={this.state.links}
					pageSize={this.state.pageSize}
					onNavigate={this.onNavigate}
					onDelete={this.onDelete}
					updatePageSize={this.updatePageSize} />
			</div>
		)
	}

	loadFromServer(pageSize) {
		traverse(client, root, [
			{rel: 'teachers', params: {size: pageSize}}]
		).then(teacherCollection => {
			return client({
				method: 'GET',
				path: teacherCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return teacherCollection;
			});
		}).done(teacherCollection => {
			this.setState({
				teachers: teacherCollection.entity._embedded.teachers,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: teacherCollection.entity._links});
		});
	}

	// tag: create[]
	onCreate(newTeacher) {
		this.state.dialog.show = false;
		traverse(client, root, ['teachers']).then(teacherCollection => {
			return client({
				method: 'POST',
				path: teacherCollection.entity._links.self.href,
				entity: newTeacher,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return traverse(client, root, [
				{rel: 'teachers', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	// end: create[]
	
	onDelete(teacher) {
		client({method: 'DELETE', path: teacher._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(teacherCollection => {
			this.setState({
				teachers: teacherCollection.entity._embedded.teachers,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: teacherCollection.entity._links
			});
		});
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

}

class TeacherList extends React.Component{
	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}	

	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}
	
	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}
	
	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}
	
	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	render() {
		const teachers = this.props.teachers.map(teacher =>
			<Teacher key={teacher._links.self.href} teacher={teacher} onDelete={this.props.onDelete}/>
		);
	
		const navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<label htmlFor="pageSize">#/Page:</label>
				<input ref="pageSize" id="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<datalist id="pageSize">
					<option value="2"/>
  					<option value="10"/>
					<option value="20"/>
					<option value="100"/>
				</datalist>
				<table>
					<tbody>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Phone Number</th>
							<th></th>
						</tr>
						{teachers}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}

class Teacher extends React.Component{
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.teacher);
	}

	render() {
		return (
			<tr>
				<td>{this.props.teacher.firstName}</td>
				<td>{this.props.teacher.lastName}</td>
				<td>{this.props.teacher.email}</td>
				<td>{this.props.teacher.phoneNumber}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.references = this.props.attributes.reduce((hash, elem) => { hash[elem] = React.createRef(); return hash }, {});
		this.state = this.props.dialogState;
	}

	handleClose(e) {
		this.setState({ show: false });
	}

	handleShow = () => {

		this.setState({
			show: true,
			title: 'Create',
			body: 'Please enter the details',
			data: this.state.data
		});
	};

	handleSubmit(refs) {
		const newTeacher = {};
		this.props.attributes.forEach(attribute => {
			newTeacher[attribute] = ReactDOM.findDOMNode(refs[attribute]).value.trim();
		});
		this.props.onCreate(newTeacher);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(refs[attribute]).value = '';
		});

		this.setState({ show: false });
	}

	render() {
		return (
			<div>
				<Button variant="primary" onClick={this.handleShow} >
					Create
				</Button>

				<MyModalComponent
					show={this.state.show}
					title={this.state.title}
					body={this.state.body}
					data={this.state.data}
					references = {this.references}
					onClose={(e) => this.handleClose(e)}
					onSubmit={(e) => this.handleSubmit(e)}
					onHide={(e) => this.handleClose(e)}
				/>

			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)