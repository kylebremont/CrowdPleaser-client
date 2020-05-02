import React, { Component } from 'react'

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
        }
    }

    componentDidMount () {
        const script = document.createElement("script");
    
        script.src = "https://use.typekit.net/foobar.js";
        script.async = true;
    
        document.body.appendChild(script);
    }

    render() {

        return (
            <div>

                
                <h1>Spotify Web Playback SDK Quick Start Tutorial</h1>
                <h2>Open your console log: <code>View > Developer > JavaScript Console</code></h2>


                {
                window.onSpotifyWebPlaybackSDKReady = () => {
                 	
                    var player = new Spotify.Player({
                        name: 'Carly Rae Jepsen Player',
                        getOAuthToken: callback => {
                        // Run code to get a fresh access token
                    
                        callback('access token here');
                        },
                        volume: 0.5
                    });
                }}
             </div>
        );
    }
}