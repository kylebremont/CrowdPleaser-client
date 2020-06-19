import React from 'react';
import { authEndpoint, clientId, redirectUri, scopes } from '../config';
import '../styles/Login.css';

export default function Login(props) {
	return (
		<div id="login-buttons">
			<div id="spotify-button">
				<a
					className="button"
					href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
						'%20'
					)}&response_type=token&show_dialog=true`}
				>
					login to spotify
				</a>
			</div>
			<div id="guest-button" onClick={() => props.guestLogin()}>
				or continue as guest
			</div>
		</div>
	);
}
