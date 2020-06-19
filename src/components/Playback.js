import React, { Component } from 'react';
import { BsFillSkipEndFill, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { Line } from 'rc-progress';
import { apiUrl } from './../config';
import '../styles/Playback.css';

export default class Playback extends Component {
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
		this.connectToSpotify = this.connectToSpotify.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.setSong = this.setSong.bind(this);
		this.getNextSong = this.getNextSong.bind(this);
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

	componentDidMount() {
		const script = document.createElement('script');

		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);
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

	playTrack() {
		const play = ({ spotify_uri, playerInstance: { _options: { getOAuthToken, id } } }) => {
			var body;
			var url;
			if (this.state.isPlaying) {
				this.startTimer();
				setTimeout(() => {
					this.getNextSong(false);
				}, this.state.song.duration - this.state.progress);
				url = `https://api.spotify.com/v1/me/player/play?device_id=${id}`;
				body = { uris: [ spotify_uri ] };
				if (this.state.progress > 0) {
					body['position_ms'] = this.state.progress;
				}
				// TELL SELF TO POP QUEUE AFTER PROGRESS >= DURATION
			} else {
				this.stopTimer();
				url = `https://api.spotify.com/v1/me/player/pause?device_id=${id}`;
				body = { uris: [ spotify_uri ] };
			}

			getOAuthToken((access_token) => {
				fetch(url, {
					method: 'PUT',
					body: JSON.stringify(body),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${access_token}`
					}
				}).catch((error) => {
					console.error('Error:', error);
				});
			});
		};

		play({
			playerInstance: this.state.player,
			spotify_uri: this.state.song.uri
		});
	}

	setSong(song) {
		fetch(`${apiUrl}change_playing?party_code=${this.state.party}`, {
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
				this.setState({ song: response }, () => this.playTrack());
			});
		// this.setState({ song }, () => this.playTrack());
	}

	connectToSpotify() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			// Define the Spotify Connect device, getOAuthToken has an actual token
			// hardcoded for the sake of simplicity
			var player = new window.Spotify.Player({
				name: 'A Spotify Web SDK Player',
				getOAuthToken: (callback) => {
					// this token has to be gotten from the stupid fucking link: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
					callback(this.state.token);
				},
				volume: 1
			});

			// Called when connected to the player created beforehand successfully
			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);

				// TODO: make device id correspond to dictionary of tokens
				var data = {};
				data[device_id] = this.state.access_code;

				// fetch(`http://localhost:3500/devices`, {
				// 	method: 'PUT',
				// 	body: JSON.stringify(data),
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 		Authorization: `Bearer ${this.state.access_code}`
				// 	}
				// }).catch((error) => {
				// 	console.error('Error:', error);
				// });

				this.setState({ player });
			});

			// Connect to the player created beforehand, this is equivalent to
			// creating a new device which will be visible for Spotify Connect
			player.connect();
		};
	}

	render() {
		return (
			<div className="container">
				<footer className="footer">
					{this.connectToSpotify()}
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
								<div className="col" id="playpausebutton">
									{/* this.setState({ isPlaying: !this.state.isPlaying }, () => this.playTrack()) */}

									<IconContext.Provider value={{ color: 'white', className: 'playpause-button' }}>
										{this.state.isPlaying ? (
											<BsFillPauseFill
												size={60}
												onClick={() =>
													this.setState({ isPlaying: !this.state.isPlaying }, () =>
														this.playTrack()
													)}
											/>
										) : (
											<BsFillPlayFill
												size={60}
												onClick={() =>
													this.setState({ isPlaying: !this.state.isPlaying }, () =>
														this.playTrack()
													)}
											/>
										)}
									</IconContext.Provider>

									<IconContext.Provider value={{ color: 'white', className: 'skip-button' }}>
										<BsFillSkipEndFill size={60} onClick={() => this.getNextSong(true)} />
									</IconContext.Provider>
								</div>
							</div>
							<Line
								percent={this.state.progress / this.state.song.duration * 100}
								strokeWidth="0.5"
								strokeColor="#E397E3"
							/>
						</div>
					)}
				</footer>
			</div>
		);
	}
}
