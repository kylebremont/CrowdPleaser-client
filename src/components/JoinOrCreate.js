import React, { Component } from 'react';
import { apiUrl } from './../config';
import './JoinOrCreate.css';

export default class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: apiUrl,
			access_token: props.access_token,
			searchValue: null,
			errorMessage: false
		};
		this.createParty = this.createParty.bind(this);
		this.joinParty = this.joinParty.bind(this);
	}

	createParty() {
		var data = {};
		data['access_token'] = this.state.access_token;

		var endpoint = 'create_party';
		fetch(this.state.url + endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.state.access_token}`
			}
		})
			.catch((error) => {
				console.error('Error:', error);
			})
			.then((response) => response.json())
			.then((response) => {
				this.props.setParty(response.party_id, true, response.member_id);
			});
	}

	joinParty() {
		var endpoint = 'join_party';
		var query = '?party_code=' + this.state.searchValue;
		fetch(this.state.url + endpoint + query, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.state.access_token}`
			}
		})
			.catch((error) => {
				console.error('Error:', error);
			})
			.then((response) => response.json())
			.then((response) => {
				if (response.statusCode === 200) {
					this.props.setParty(this.state.searchValue, false, response.member_id);
				} else {
					this.setState({ errorMessage: true });
				}
			});
	}

	render() {
		return (
			<div className="JoinOrCreate">
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<input onChange={(e) => this.setState({ searchValue: e.target.value })} />
				<br />
				<br />
				<a id="join" onClick={this.joinParty}>
					Join party
				</a>
				<br />
				<br />
				{this.state.errorMessage && <div id="error">Invalid party code</div>}
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				or{' '}
				<a id="create" onClick={this.createParty}>
					create your own party
				</a>
			</div>
		);
	}
}
