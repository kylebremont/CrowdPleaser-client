import React, { Component } from 'react';
import PlaylistItem from './PlaylistItem';
import SearchResult from './SearchResult';
import { IoIosArrowBack } from 'react-icons/io';
import { IconContext } from 'react-icons';
import '../styles/Playlists.css';

export default class Playlists extends Component {
	constructor(props) {
		super(props);

		this.state = {
			access_token: props.access_token,
			playlists: [],
			tracks: [],
			display_tracks: false
		};

		this.GetPlaylists = this.GetPlaylists.bind(this);
		this.GetTracks = this.GetTracks.bind(this);
		this.getSongUri = this.getSongUri.bind(this);
	}

	GetPlaylists() {
		fetch(`https://api.spotify.com/v1/me/playlists`, {
			headers: {
				Authorization: `Bearer ${this.state.access_token}`
			}
		})
			.then((res) => res.json())
			.then(
				(res) => {
					let playlists = [];
					for (let i = 0; i < res.items.length; i++) {
						let playlist = {
							id: res.items[i].id,
							image: res.items[i].images[0].url,
							name: res.items[i].name
						};
						playlists.push(playlist);
					}
					this.setState({ playlists });
				},
				(error) => {
					console.error(error);
				}
			);
	}

	GetTracks(id) {
		fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
			headers: {
				Authorization: `Bearer ${this.state.access_token}`
			}
		})
			.then((res) => res.json())
			.then(
				(res) => {
					let tracks = [];
					for (let i = 0; i < res.items.length; i++) {
						let trackInfo = res.items[i].track;
						let track = {
							name: trackInfo.name,
							artist: trackInfo.album.artists[0].name,
							image: trackInfo.album.images[0].url,
							duration: trackInfo.duration_ms,
							uri: trackInfo.uri
						};
						tracks.push(track);
					}
					this.setState({ tracks, display_tracks: true });
				},
				(error) => {
					console.error(error);
				}
			);
	}

	getSongUri(songInfo) {
		this.props.addToQueue(songInfo);
	}

	componentDidMount() {
		this.GetPlaylists();
	}

	render() {
		return (
			<div id="playlists">
				<div className="upper-row">
					{this.state.display_tracks === true && (
						<div onClick={() => this.setState({ display_tracks: false })}>
							<IconContext.Provider value={{ color: 'white', className: 'back-button' }}>
								<IoIosArrowBack size={40} onClick={() => this.setState({ display_tracks: false })} />
							</IconContext.Provider>
							go back
						</div>
					)}
				</div>
				<div className="scrollable">
					{this.state.playlists.length !== 0 &&
						this.state.display_tracks === false &&
						this.state.playlists.map((playlist, i) => {
							return <PlaylistItem key={i} data={playlist} GetTracks={this.GetTracks} />;
						})}

					{this.state.display_tracks === true &&
						this.state.tracks.map((song, i) => {
							return <SearchResult key={i} data={song} getSongUri={this.getSongUri} />;
						})}
				</div>
			</div>
		);
	}
}
