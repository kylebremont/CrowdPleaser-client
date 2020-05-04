import React, { Component } from 'react';
import { clientId, secret } from '../config';

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: props.access_code,
            player: null,
            trackURI: null,
        }
        this.connectToSpotify = this.connectToSpotify.bind(this);
        this.playTrack = this.playTrack.bind(this);
        this.setTrackURI = this.setTrackURI.bind(this);
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
            getOAuthToken(access_token => {
              fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
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
            spotify_uri: this.state.trackURI,
        });
      }

    setTrackURI(trackURI) {
        this.setState({trackURI}, () => this.playTrack());
    }

    render() {

        // const backgroundStyles = {
        //     backgroundImage:`url(${
        //       this.props.item.album.images[0].url
        //     })`,
        //   };
        
        //   const progressBarStyles = {
        //     width: (this.props.progress_ms * 100 / this.props.item.duration_ms) + '%'
        //   };
        
        return (
            <div className="App">
                {this.connectToSpotify()}
            {/* <div className="main-wrapper">
              <div className="now-playing__img">
                <img src={this.props.item.album.images[0].url} />
              </div>
              <div className="now-playing__side">
                <div className="now-playing__name">{this.props.item.name}</div>
                <div className="now-playing__artist">
                  {this.props.item.artists[0].name}
                </div>
                <div className="now-playing__status">
                  {this.props.is_playing ? "Playing" : "Paused"}
                </div>
                <div className="progress">
                  <div className="progress__bar" style={progressBarStyles} />
                </div>
              </div>
              <div className="background" style={backgroundStyles} />{" "}
            </div> */}
          </div>
        );
    }
}