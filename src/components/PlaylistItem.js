import React, { Component } from 'react';
import '../styles/SearchResult.css';

export default class PlaylistItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.data.name,
			image: props.data.image,
			id: props.data.id
		};
	}

	render() {
		return (
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => {
					this.props.GetTracks(this.state.id);
				}}
			>
				<div id="row">
					<div id="art-column">
						<img src={this.state.image} alt="album cover" className="imgz" />
					</div>
					<div id="info-column">
						<div id="song-title">{this.state.name}</div>
					</div>
				</div>
			</div>
		);
	}
}
