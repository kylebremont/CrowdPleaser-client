import React from 'react';
import { apiUrl } from '../config';
import '../styles/Login.css';

export default function Login(props) {
	return (
		<div id="login-buttons">
			<div id="spotify-button">
				<a
					className="button"
					// href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
					// 	'%20'
					// )}&response_type=token&show_dialog=true`}
					href={`${apiUrl}login`}
				>
					login to spotify
				</a>
			</div>

			<div id="guest-button">
				or{' '}
				<div
					style={{ cursor: 'pointer', fontWeight: 'bold', display: 'inline' }}
					onClick={() => props.guestLogin()}
				>
					continue as guest
				</div>
			</div>
		</div>
	);
}
