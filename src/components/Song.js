import React, { Component } from 'react';
import '../styles/Song.css';

export default class Song extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.data.name,
			artist: props.data.artist,
			uri: props.data.uri,
			image: props.data.image,
			duration: props.data.duration,
			votes: 0,
			voted: []
		};
	}

	render() {
		return (
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => {
					this.props.getSongUri(this.state);
				}}
			>
				<div className="row">
					<div className="col-4 text-right" id="over">
						<img src={this.state.image} alt="album cover" className="imgz" />
					</div>
					<div className="col-8">
						<div className="row">
							<div className="song-title">{this.state.name}</div>
						</div>
						<div className="row">
							<div className="song-artist">{this.state.artist}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
