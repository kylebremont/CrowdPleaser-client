import React, { Component } from 'react';
import Spotify from 'node-spotify-api'
import { clientId, secret } from '../config';
import SearchResult from "./SearchResult"
import { Button } from 'react-bootstrap';

export default class Search extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: props.access_code,
            player: null,
            trackURI: null,
            searchValue: '',
            songs: []
        }
        this.searchSpotify = this.searchSpotify.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getSongUri = this.getSongUri.bind(this);

    }

    // componentDidMount () {
    //     const script = document.createElement("script");
    
    //     script.src = "https://sdk.scdn.co/spotify-player.js";
    //     script.async = true;
    
    //     document.body.appendChild(script);
    // }

    // playTrack() {
    //   const play = ({
    //       spotify_uri,
    //       playerInstance: {
    //         _options: {
    //           getOAuthToken,
    //           id
    //         }
    //       }
    //     }) => {
    //       getOAuthToken(access_token => {
    //         fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
    //           method: 'PUT',
    //           body: JSON.stringify({ uris: [spotify_uri] }),
    //           headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${access_token}`
    //           },
    //         })
    //         .catch((error) => {
    //           console.error('Error:', error);
    //         });
    //       });
    //     };
    
    //     play({
    //       playerInstance: this.state.player,
    //       spotify_uri: this.state.trackURI,
    //   });
    // }

   

    // connectToSpotify() {
    //     window.onSpotifyWebPlaybackSDKReady = () => {
    //         // Define the Spotify Connect device, getOAuthToken has an actual token 
    //      // hardcoded for the sake of simplicity
    //      var player = new window.Spotify.Player({
    //        name: 'A Spotify Web SDK Player',
    //        getOAuthToken: callback => {
     
    //          // this token has to be gotten from the stupid fucking link: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
    //          callback(this.state.access_code);
    //        },
    //        volume: 0.1
    //      });
     
    //      // Called when connected to the player created beforehand successfully
    //      player.addListener('ready', ({ device_id }) => {
    //        console.log('Ready with Device ID', device_id);

    //        // TODO: make device id correspond to dictionary of tokens
    //         var data = {}
    //         data[device_id] = this.state.access_code;
      
    //         fetch(`http://localhost:3500/devices`, {
    //               method: 'PUT',
    //               body: JSON.stringify(data),
    //               headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${this.state.access_code}`
    //               },
    //             })
    //             .catch((error) => {
    //               console.error('Error:', error);
    //             });
      
    //         this.setState({player});
    //       });
      
    //      // Connect to the player created beforehand, this is equivalent to 
    //      // creating a new device which will be visible for Spotify Connect
    //      player.connect();

    //     }
    // }

    searchSpotify() {
      var spotify = new Spotify({
          id: clientId,
          secret: secret
      });
      if (this.state.searchValue === undefined) {
        return;
      }
      spotify.search({ type: 'track', query: this.state.searchValue}, (err, data) => {
          if (err) {
            return console.log(err);
          }
          var songs = []
          for (let i = 0; i < 20; i++) {
            let song = data.tracks.items[i];
            songs.push({"name": song.name, "artist": song.artists[0].name, "uri": song.uri, "duration": song.duration_ms})
          }
          // this.setState({trackURI, songs});
          this.setState({songs});
      });
    }

    handleChange(event) {
      if (event.target.value === "" ) {
        this.setState({songs: undefined})
        return;
      }
      this.setState({searchValue: event.target.value, songs: []}, this.searchSpotify);

    }

    handleEnter(event) {
      event.preventDefault();
    }

    getSongUri(songInfo) {
      this.setState({trackURI: songInfo.trackURI}, () => this.props.addToQueue(songInfo));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleEnter}>
                    <label>
                        Song:
                        <input type="text" name="song" onChange={this.handleChange}/>
                    </label>
                </form>
                {this.state.songs !== undefined && this.state.songs.map((song,i) => {
                    return<SearchResult key={i} data={song} getSongUri={this.getSongUri}></SearchResult>
                })}
             </div>
        );
    }
}