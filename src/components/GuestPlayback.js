import React, { Component } from 'react';
import { Line } from 'rc-progress';
import '../styles/Playback.css';
import { apiUrl } from './../config';

export default class GuestPlayback extends Component {
	constructor(props) {
		super(props);

		this.state = {
			party: props.party,
			token: props.access_code,
			player: null,
			song: {
				name: null,
				uri: null,
				duration: null,
				image: null,
				artist: null
			},
			isPlaying: true,
			// timer stuff
			progress: 0,
			isOn: false,
			start: 0
		};
		this.setSong = this.setSong.bind(this);
		this.getNextSong = this.getNextSong.bind(this);
		this.GetCurrentlyPlaying = this.GetCurrentlyPlaying.bind(this);
		// timer stuff
		this.startTimer = this.startTimer.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
	}

	startTimer() {
		this.setState({
			isOn: true,
			progress: this.state.progress,
			start: Date.now() - this.state.progress
		});
		this.timer = setInterval(
			() =>
				this.setState({
					progress: Date.now() - this.state.start
				}),
			1
		);
	}

	stopTimer() {
		this.setState({ isOn: false });
		clearInterval(this.timer);
	}

	resetTimer() {
		this.setState({ progress: 0, isOn: false });
	}

	GetCurrentlyPlaying() {
		fetch(`${apiUrl}currently_playing?party_code=${this.state.party}`).then((res) => res.json()).then(
			(res) => {
				this.setState({ song: res });
			},
			(error) => {
				console.error(error);
			}
		);
	}

	componentDidMount() {
		this.GetCurrentlyPlaying();
	}

	getNextSong(skipped) {
		var timePlayed = this.state.progress;

		console.log(this.state.song.duration);
		console.log(timePlayed);
		if ((this.state.isPlaying && this.state.song.duration <= timePlayed + 10) || skipped) {
			this.stopTimer();
			this.resetTimer();
			// fetch song from queue
			console.log('requesting song');
			this.props.requestSong();
		} else {
			return;
		}
	}

	setSong(song) {
		this.setState({ song });
	}

	render() {
		return (
			<div className="container">
				<footer className="footer">
					{this.state.song.name && (
						<div>
							<div className="row">
								<div className="col">
									<img src={this.state.song.image} id="playback-thumbnail" alt="album cover" />
								</div>
								<div className="col">
									<div>
										{this.state.song.name}
										<br />
										{this.state.song.artist}
									</div>
								</div>
								<div className="col" />
							</div>
							<Line
								percent={this.state.progress / this.state.song.duration * 100}
								strokeWidth="0.5"
								strokeColor="green"
							/>
						</div>
					)}
				</footer>
			</div>
		);
	}
}
