import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import * as $ from 'jquery';
import { authEndpoint, clientId, redirectUri, scopes } from '../config';
import './Login.css';
import hash from '../hash';
var fs = require('fs');

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			token: null
		};
		this.retrieveToken = this.retrieveToken.bind(this);
	}

	retrieveToken() {
		// Make a call using the token
		$.ajax({
			url: `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
				'%20'
			)}&response_type=token&show_dialog=true`,
			type: 'GET',
			success: (data) => {
				console.log(data);
				this.setState({
					item: data.item,
					is_playing: data.is_playing,
					progress_ms: data.progress_ms
				});
			}
		});
	}

	componentDidMount() {
		// Set token
		let _token = hash.access_token;
		console.log('hllo');
		if (_token) {
			// Set token

			// fs.appendFileSync('./../config.js', "export const secret = " + _token + ";");
			fs.appendFile('message.txt', 'data to append', function(err) {
				if (err) throw err;
				console.log('Saved!');
			});

			this.setState({
				token: _token
			});
		}
	}

	render() {
		return (
			<div className="Login">
				<Button
					href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
						'%20'
					)}&response_type=token&show_dialog=true`}
				>
					Login to Spotify
				</Button>
			</div>
		);
	}
}
