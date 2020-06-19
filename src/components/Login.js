import React from 'react';
import { authEndpoint, clientId, redirectUri, scopes } from '../config';
import '../styles/Login.css';

export default function Login(props) {
	return (
		<div id="login-buttons">
			<div className="row">
				<div className="col">
					<a
						className="button"
						href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
							'%20'
						)}&response_type=token&show_dialog=true`}
					>
						login to spotify
					</a>
				</div>
			</div>
		</div>
	);
}
