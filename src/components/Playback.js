import React, { Component } from 'react';
import Spotify from 'node-spotify-api'

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: "BQBlWiDjLtLm2BvJ6id4pTOChx-p7nrPgYAjqF2hD7Uf3JyXjaar0j1rgkokdGqSBJ98AR1v2gnLoDPDiEE5ejmWC5M8-9GFNPuIWL6wkm26Q0Bx2BnAsbR_s_j8ln6EyyDjol4Ol3HUi1B2vUQxBKFQgtEMCNtDwLP8",
            player: null,
            trackURI: null,
            searchValue: '',
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
          id: '5c24a8e608774631812a8325b2b4057a',
          secret: '4837b819f7cd4cae8f4685c3b7906e5e'
      });
      if (this.state.searchValue === undefined) {
        return;
      }
      spotify.search({ type: 'track', query: this.state.searchValue}, (err, data) => {
          if (err) {
            return console.log(err);
          }
          var trackURI = data.tracks.items[0].uri;
          this.setState({trackURI}, this.playTrack);
      });
    }

    handleChange(event) {
      if (event.target.value === "" ) {
        return;
      }
      this.setState({searchValue: event.target.value}, this.searchSpotify);

    }

    render() {

        return (
            <div>
                <h1>Spotify Web Playback SDK Quick Start Tutorial</h1>
                <h2>Open your console log: <code>View > Developer > JavaScript Console</code></h2>
                {this.connectToSpotify()}
                <form>
                    <label>
                        Song:
                        <input type="text" name="song" onChange={this.handleChange}/>
                    </label>
                </form>
             </div>
        );
    }
}