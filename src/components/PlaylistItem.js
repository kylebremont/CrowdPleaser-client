import React, { Component } from 'react';
import '../styles/Song.css';

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
				<div className="row">
					<div className="col-4 text-right">
						<img src={this.state.image} alt="album cover" className="imgz" />
					</div>
					<div className="col-8">
						<div className="row">
							<div className="song-title">{this.state.name}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
