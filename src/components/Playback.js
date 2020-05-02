import React, { Component } from 'react'

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            token: props.token,
        }

        this.doThing = this.doThing.bind(this);

    }

    componentDidMount () {
        const script = document.createElement("script");
    
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    }

    doThing() {
        
        window.onSpotifyWebPlaybackSDKReady = () => {
            // Define the Spotify Connect device, getOAuthToken has an actual token 
         // hardcoded for the sake of simplicity
         var player = new window.Spotify.Player({
           name: 'A Spotify Web SDK Player',
           getOAuthToken: callback => {
     
             // this token has to be gotten from the stupid fucking link: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
             callback(this.state.token);
           },
           volume: 0.1
         });
     
         // Called when connected to the player created beforehand successfully
         player.addListener('ready', ({ device_id }) => {
           console.log('Ready with Device ID', device_id);
     
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
             playerInstance: player,
             spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
           });
         });
     
         // Connect to the player created beforehand, this is equivalent to 
         // creating a new device which will be visible for Spotify Connect
         player.connect();
        }
    }

    render() {

        return (
            <div>
                <h1>Spotify Web Playback SDK Quick Start Tutorial</h1>
                <h2>Open your console log: <code>View > Developer > JavaScript Console</code></h2>
                {
                    this.doThing()
                }
             </div>
        );
    }
}