import React, { Component } from 'react';
import { apiUrl } from './../config';
import '../styles/JoinOrCreate.css';

export default class JoinOrCreate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: apiUrl,
			access_token: props.access_token,
			isGuest: props.isGuest,
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
			<div id="JoinOrCreate">
				<div id="header">
					welcome to crowdpleaser! <br />
					if you have a party code enter it below
					{!this.state.isGuest && (
						<div id="create">
							or{' '}
							<div
								style={{
									cursor: 'pointer',
									fontWeight: 'bold',
									display: 'inline',
									textDecoration: 'underline'
								}}
								onClick={this.createParty}
							>
								click here to create your own party
							</div>
						</div>
					)}
				</div>
				<div id="join">
					<div id="inputBox">
						<input onChange={(e) => this.setState({ searchValue: e.target.value })} />
					</div>
					<a className="button" style={{ cursor: 'pointer', color: 'black' }} onClick={this.joinParty}>
						join party
					</a>
					{this.state.errorMessage && <div id="error">invalid party code</div>}
				</div>
			</div>
		);
	}
}
