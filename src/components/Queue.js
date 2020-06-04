import React, { Component } from 'react';
import QueueItem from './QueueItem';
import './Queue.css';

export default class Queue extends Component {
	constructor(props) {
		super(props);

		this.state = {
			queue: [],
			isPlaying: false
		};
		this.enqueue = this.enqueue.bind(this);
		this.dequeue = this.dequeue.bind(this);
	}

	enqueue(song) {
		var queue = this.state.queue;
		// first time song is selected, start playing and don't add to queue
		if (!this.state.isPlaying) {
			this.setState({ isPlaying: true }, () => this.props.playSong(song));
		} else {
			queue.push(song);
			this.setState({ queue });
		}
	}

	dequeue() {
		if (this.state.queue.length === 0) {
			// if there is nothing in the queue, set isPlaying to false for next song choice
			this.setState({ isPlaying: false });
		} else {
			var queue = this.state.queue;
			var upNext = queue.shift();
			this.setState({ queue });
			console.log(upNext);
			this.props.playSong(upNext);
		}
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
								return <QueueItem key={i} rank={i} data={song} getSongUri={this.getSongUri} />;
							})}
					</div>
				</div>
			</div>
		);
	}
}
