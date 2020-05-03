import React, { Component } from 'react';
import Spotify from 'node-spotify-api'
import { clientId, secret } from '../config';
import Song from "./Song"

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: props.access_code,
            player: null,
            trackURI: null,
            searchValue: '',
            songs: []
        }

        this.connectToSpotify = this.connectToSpotify.bind(this);
        this.searchSpotify = this.searchSpotify.bind(this);
        this.playTrack = this.playTrack.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    componentDidMount () {
        const script = document.createElement("script");
    
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
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
            });
          });
        };
    
        play({
          playerInstance: this.state.player,
          spotify_uri: this.state.trackURI,
      });
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
     
           this.setState({player});
         });
     
         // Connect to the player created beforehand, this is equivalent to 
         // creating a new device which will be visible for Spotify Connect
         player.connect();
        }
    }

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
          var trackURI = data.tracks.items[0].uri;
          var songs = []
          // console.log(data.tracks.items);
          for (let i = 0; i < 20; i++) {
            let song = data.tracks.items[i];
            songs.push({"name": song.name, "artist": song.artists[0].name, "uri": song.uri, "duration": song.duration_ms})
          }
          this.setState({trackURI, songs}, this.playTrack);
      });
    }

    handleChange(event) {
      if (event.target.value === "" ) {
        return;
      }
      this.setState({searchValue: event.target.value, songs: []}, this.searchSpotify);

    }

    render() {
        return (
            <div>
                <h1>welcome to crowdpleaser</h1>
                {this.connectToSpotify()}
                <form>
                    <label>
                        Song:
                        <input type="text" name="song" onChange={this.handleChange}/>
                    </label>
                </form>
                {this.state.songs.map(function(song,i){
                    console.log(song)
                    return<Song key={i} data={song}></Song>
                })}
             </div>
        );
    }
}