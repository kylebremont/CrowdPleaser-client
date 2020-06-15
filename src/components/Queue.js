import React, { Component } from 'react';
import QueueItem from './QueueItem';
import './Queue.css';

export default class Queue extends Component {
	constructor(props) {
		super(props);

		this.state = {
			current_song: null,
			queue: [],
			isPlaying: false,
			party: props.party,
			isHost: props.isHost
		};
		this.enqueue = this.enqueue.bind(this);
		this.dequeue = this.dequeue.bind(this);
		this.GetQueue = this.GetQueue.bind(this);
		this.GetCurrentlyPlaying = this.GetCurrentlyPlaying.bind(this);
	}

	enqueue(song) {
		// first time song is selected, start playing and don't add to queue
		if (!this.state.isPlaying && this.state.isHost) {
			this.setState({ isPlaying: true }, () => this.props.playSong(song));
		} else {
			fetch(`http://localhost:3500/queue_song?party_code=${this.state.party}`, {
				method: 'PUT',
				body: JSON.stringify(song),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.catch((error) => {
					console.error('Error:', error);
				})
				.then((response) => response.json())
				.then((response) => {
					this.setState({ queue: response });
				});
			// this.setState({ queue });
		}
	}

	dequeue() {
		if (this.state.queue.length === 0) {
			// if there is nothing in the queue, set isPlaying to false for next song choice
			// this.setState({ current_song: queue[0] });
			this.setState({ isPlaying: false });
		} else {
			var queue = this.state.queue;
			this.setState({ current_song: queue[0] });
			var upNext = queue.shift();
			console.log(upNext);

			fetch(`http://localhost:3500/dequeue_song?party_code=${this.state.party}`, {
				method: 'PUT'
			})
				.catch((error) => {
					console.error('Error:', error);
				})
				.then((response) => response.json())
				.then((response) => {
					this.setState({ queue: response }, () => this.props.playSong(upNext));
				});
		}
	}

	GetQueue() {
		fetch(`http://localhost:3500/queue?party_code=${this.state.party}`)
			.catch((error) => {
				console.error('Error:', error);
			})
			.then((response) => response.json())
			.then((response) => {
				this.setState({ queue: response });
			});
	}

	GetCurrentlyPlaying() {
		fetch(`http://localhost:3500/currently_playing?party_code=${this.state.party}`)
			.catch((error) => {
				console.error('Error:', error);
			})
			.then((response) => response.json())
			.then((response) => {
				if (response.length !== 0) {
					this.setState({ current_song: response, isPlaying: true });
				}
			});
	}

	componentDidMount() {
		this.GetQueue();
		this.GetCurrentlyPlaying();
	}

	render() {
		return (
			<div>
				<div className="Queue">
					{this.state.queue.length === 0 && (
						<div className="queue-warning">Search for songs to add to queue.</div>
					)}

					<div id="queue-scrollbox">
						{this.state.queue !== undefined &&
							this.state.queue.map((song, i) => {
								// console.log('IN QUEUE');
								// console.log(song);
								return (
									<QueueItem
										key={i}
										rank={i + 1}
										data={song}
										party={this.state.party}
										getSongUri={this.getSongUri}
									/>
								);
							})}
					</div>
				</div>
			</div>
		);
	}
}
