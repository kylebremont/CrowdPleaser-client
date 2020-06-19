import React, { Component } from 'react';
import QueueItem from './QueueItem';
import { IconContext } from 'react-icons';
import { FiRefreshCw } from 'react-icons/fi';
import { apiUrl } from './../config';
import '../styles/Queue.css';

export default class Queue extends Component {
	constructor(props) {
		super(props);

		this.state = {
			current_song: null,
			queue: [],
			isPlaying: false,
			party: props.party,
			isHost: props.isHost,
			memberId: props.memberId
		};
		this.enqueue = this.enqueue.bind(this);
		this.dequeue = this.dequeue.bind(this);
		this.GetQueue = this.GetQueue.bind(this);
		this.GetCurrentlyPlaying = this.GetCurrentlyPlaying.bind(this);
		this.HandleVote = this.HandleVote.bind(this);
	}

	enqueue(song) {
		// first time song is selected, start playing and don't add to queue
		if (!this.state.isPlaying && this.state.isHost) {
			this.setState({ isPlaying: true }, () => this.props.playSong(song));
		} else {
			fetch(`${apiUrl}queue_song?party_code=${this.state.party}`, {
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

			fetch(`${apiUrl}dequeue_song?party_code=${this.state.party}`, {
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

	GetQueue(dequeue) {
		fetch(`${apiUrl}queue?party_code=${this.state.party}`)
			.catch((error) => {
				console.error('Error:', error);
			})
			.then((response) => response.json())
			.then((response) => {
				if (dequeue) {
					this.setState({ queue: response }, () => this.dequeue());
				} else {
					this.setState({ queue: response });
				}
			});
	}

	GetCurrentlyPlaying() {
		fetch(`${apiUrl}currently_playing?party_code=${this.state.party}`)
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

	HandleVote(uri) {
		var song = null;
		for (let i = 0; i < this.state.queue.length; i++) {
			if (uri === this.state.queue[i].uri) {
				song = this.state.queue[i];
			}
		}

		fetch(`${apiUrl}vote?party_code=${this.state.party}&member_id=${this.state.memberId}`, {
			method: 'PUT',
			body: JSON.stringify({ uri: song.uri }),
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
	}

	componentDidMount() {
		this.GetQueue(false);
		this.GetCurrentlyPlaying();
	}

	render() {
		return (
			<div>
				<div className="Queue">
					<div className="upper-row">
						<div onClick={() => this.GetQueue(false)}>
							<IconContext.Provider value={{ color: 'white', className: 'refresh-button' }}>
								<FiRefreshCw size={30} />
							</IconContext.Provider>
							&nbsp;refresh
						</div>

						{this.state.queue.length === 0 && (
							<div className="queue-warning">search for songs to add to queue.</div>
						)}
					</div>
					<div className="scrollable">
						{this.state.queue !== undefined &&
							this.state.queue.map((song, i) => {
								return (
									<div
										style={{ cursor: 'pointer' }}
										onClick={() => {
											this.HandleVote(song.uri);
										}}
										key={i}
									>
										<div id="row">
											<div id="rank-column">
												<div id="song-rank">{song.rank}</div>
											</div>
											<div id="art-column">
												<img src={song.image} alt="album cover" className="imgz" />
											</div>
											<div id="info-column">
												<div id="song-title">{song.name}</div>
												<br />
												<div id="song-artist">{song.artist}</div>
											</div>
											<div id="vote-column">
												<div id="votes">votes: {song.votes}</div>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		);
	}
}
