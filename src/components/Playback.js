import React, { Component } from 'react';
import Spotify from 'node-spotify-api'

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: "BQD3G0VeBQTt9IeDQMd63fBUc_XpuORj1W7sVDBHkVqUtg4P66GHJ3RQaelYuu8U6XjDJj6j9ScdQIILkdmDkhorugjNKIERdtHGEwxGb8HyQKjzyl7aaClpvWzZN4y_bakTbyWvCG3xR7UmNV4YhU3YS9LdYD8EIjbE",
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
        console.log(this.state.searchValue)
        if (this.state.searchValue === undefined) {
          console.log('im upset')
          return;
        }
        spotify.search({ type: 'track', query: this.state.searchValue}, (err, data) => {
            if (err) {
              console.log("im a bitch");
              return console.log(err);
            }
            var trackURI = data.tracks.items[0].uri;
            this.setState({trackURI}, this.playTrack);
        });
    }

    handleChange(event) {
      this.setState({searchValue: event.target.value});
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
                    <input type="submit" value="Submit" onClick={this.searchSpotify} />
                </form>
             </div>
        );
    }
}