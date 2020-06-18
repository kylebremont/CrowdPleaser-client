import React, { Component } from 'react';
import './QueueItem.css';

export default class SearchResult extends Component {
	constructor(props) {
		super(props);

		this.state = {
			party: props.party,
			name: props.data.name,
			artist: props.data.artist,
			uri: props.data.uri,
			image: props.data.image,
			duration: props.data.duration,
			rank: props.rank,
			votes: props.data.votes
		};

		this.HandleVote = this.HandleVote.bind(this);
	}

	HandleVote() {
		fetch(`http://localhost:3500/vote?party_code=${this.state.party}`, {
			method: 'PUT',
			body: JSON.stringify({ uri: this.state.uri }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.catch((error) => {
				console.error('Error:', error);
			})
			.then((response) => response.json())
			.then((response) => {
				this.setState({ votes: response.votes });
			});
	}

	render() {
		// console.log('IN ITEM');
		// console.log(this.state);
		// console.log('\n\n\n');
		return (
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => {
					this.HandleVote();
				}}
			>
				<div id="row">
					<div id="rank-column">
						<div id="song-rank">{this.state.rank}</div>
					</div>
					<div id="art-column">
						<img src={this.state.image} alt="album cover" className="imgz" />
					</div>
					<div id="info-column">
						<div id="song-title">{this.state.name}</div>
						<br />
						<div id="song-artist">{this.state.artist}</div>
					</div>
					<div id="vote-column">
						<div id="votes">votes: {this.state.votes}</div>
					</div>
				</div>
			</div>
		);
	}
}
