import React, { Component } from 'react';
import { clientId, secret } from '../config';
import logo from '../spotify.svg';
import { Button } from 'react-bootstrap';
import PlayPause from './PlayPause'

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: props.access_code,
            player: null,
            song: {
                name: null,
                uri: null,
                duration: null,
                image: null,
                artist: null,
            },
            isPlaying: true,
            progress: 0
        }
        var startTime = null;
        this.connectToSpotify = this.connectToSpotify.bind(this);
        this.playTrack = this.playTrack.bind(this);
        this.setSong = this.setSong.bind(this);
    }


    componentDidMount () {
        const script = document.createElement("script");
    
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    }

    connectToSpotify() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            // Define the Spotify Connect device, getOAuthToken has an actual token 
         // hardcoded for the sake of simplicity
         var player = new window.Spotify.Player({
           name: 'A Spotify Web SDK Player',
           getOAuthToken: callback => {
     
             // this token has to be gotten from the stupid fucking link: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
             callback(this.state.access_code);
           },
           volume: 0.1
         });
     
         // Called when connected to the player created beforehand successfully
         player.addListener('ready', ({ device_id }) => {
           console.log('Ready with Device ID', device_id);

           // TODO: make device id correspond to dictionary of tokens
            var data = {}
            data[device_id] = this.state.access_code;
      
            fetch(`http://localhost:3500/devices`, {
                  method: 'PUT',
                  body: JSON.stringify(data),
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.access_code}`
                  },
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
      
            this.setState({player});
          });
      
         // Connect to the player created beforehand, this is equivalent to 
         // creating a new device which will be visible for Spotify Connect
         player.connect();

        }
    }

    playTrack() {
        const play = ({
            spotify_uri,
            playerInstance: {
              _options: {
                getOAuthToken,
                id
              }
            }
          }) => {
              
            // TODO: fix seeking 
            if (this.state.isPlaying) {
                this.startTime = new Date().getTime();
                var url =`https://api.spotify.com/v1/me/player/play?device_id=${id}`
                console.log(this.startTime);
            } else {
                this.endTime = new Date().getTime();
                var url = `https://api.spotify.com/v1/me/player/pause?device_id=${id}`
                console.log(this.startTime);
            }
            var playState = this.state.isPlaying ?  'play' : 'pause';

            getOAuthToken(access_token => {
                fetch(url, {
                method: 'PUT',
                body: JSON.stringify({ uris: [spotify_uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                })
                .catch((error) => {
                console.error('Error:', error);
                });
            });
        };
    
        play({
            playerInstance: this.state.player,
            spotify_uri: this.state.song.uri,
        });
    }

    setSong(song) {
        this.setState({song}, () => this.playTrack());
    }

    render() {
        
        return (
            <div className="App">
                {this.connectToSpotify()}
            {!this.state.song.name && (
                <div>
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1>welcome to crowdpleaser</h1>
                </div>
            )}

            {this.state.song.name && (
            <div className="main-wrapper">
              <div className="now-playing__img">
                <img src={this.state.song.image} />
              </div>
              <div className="now-playing__side">
                <div className="now-playing__name">{this.state.song.name}</div>
                <div className="now-playing__artist">
                  {this.state.song.artist}
                  <PlayPause  
                    toggle={this.state.isPlaying}
                    onClick={() => this.setState({isPlaying: !this.state.isPlaying}, () => this.playTrack())}>
                 </PlayPause>
                </div>
              </div>
            </div>
            )}
          </div>
        );
    }
}