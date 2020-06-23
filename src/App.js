import React, { Component } from 'react';
import getHashParams from './hash';
import Search from './components/Search';
import Queue from './components/Queue';
import Playback from './components/Playback';
import GuestPlayback from './components/GuestPlayback';
import JoinOrCreate from './components/JoinOrCreate';
import Playlists from './components/Playlists';
import Login from './components/Login';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './App.css';
import './styles/tabs.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			token: null,
			loggedIn: false,
			songInfo: null,
			party: null,
			isHost: false,
			isGuest: false,
			memberId: null,
			userInfo: []
		};

		this.queueElement = React.createRef();
		this.playbackElement = React.createRef();

		this.playSong = this.playSong.bind(this);

		this.addToQueue = this.addToQueue.bind(this);
		this.requestSong = this.requestSong.bind(this);

		this.setParty = this.setParty.bind(this);
		this.guestLogin = this.guestLogin.bind(this);
	}

	componentDidMount() {
		let params = getHashParams();
		let _token = params.access_token;
		// console.log(params.access_token);
		// console.log(params.refresh_token);
		// console.log(params);

		if (_token) {
			// get user profile info
			fetch(`https://api.spotify.com/v1/me`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${_token}`
				}
			})
				.catch((error) => {
					console.error('Error:', error);
				})
				.then((response) => response.json())
				.then((response) => {
					this.setState({ token: _token, loggedIn: true, userInfo: response });
				});
		}
	}

	setParty(party_id, isHost, memberId) {
		this.setState({ party: party_id, isHost, memberId });
	}

	addToQueue(songInfo) {
		this.queueElement.current.enqueue(songInfo);
	}

	requestSong() {
		this.queueElement.current.GetQueue(true);
	}

	playSong(song) {
		this.playbackElement.current.setSong(song);
	}

	guestLogin() {
		this.setState({ loggedIn: true, isGuest: true });
	}

	render() {
		return (
			<div className="App">
				<div className="App-head">crowdpleaser</div>
				{/* if not logged in or in a party */}
				{!this.state.loggedIn && !this.state.party && <Login guestLogin={this.guestLogin} />}

				{/* if logged in, but not in a party */}
				{this.state.loggedIn &&
				!this.state.party && (
					<div className="App-content">
						<JoinOrCreate
							access_token={this.state.token}
							isGuest={this.state.isGuest}
							setParty={this.setParty}
							userInfo={this.state.userInfo}
						/>
					</div>
				)}

				{/* if logged in and in a party */}
				{this.state.loggedIn &&
				this.state.party && (
					<div className="App-content">
						party code: <div style={{ fontWeight: 'bold' }}>{this.state.party}</div>
						<Tabs forceRenderTabPanel={true}>
							<TabList>
								<Tab>up next</Tab>
								<Tab>search</Tab>
								<Tab>playlists</Tab>
							</TabList>

							<TabPanel>
								<Queue
									ref={this.queueElement}
									playSong={this.playSong}
									party={this.state.party}
									isHost={this.state.isHost}
									memberId={this.state.memberId}
								/>
							</TabPanel>
							<TabPanel>
								<Search addToQueue={this.addToQueue} memberId={this.state.memberId} />
							</TabPanel>
							<TabPanel>
								<Playlists
									access_token={this.state.token}
									isGuest={this.state.isGuest}
									addToQueue={this.addToQueue}
								/>
							</TabPanel>
						</Tabs>
						{this.state.isHost && (
							<Playback
								ref={this.playbackElement}
								access_code={this.state.token}
								requestSong={this.requestSong}
								party={this.state.party}
							/>
						)}
						{!this.state.isHost && (
							<GuestPlayback
								ref={this.playbackElement}
								requestSong={this.requestSong}
								party={this.state.party}
							/>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default App;
