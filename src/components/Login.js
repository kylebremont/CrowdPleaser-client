import React, {Component } from 'react';
import { Button } from 'react-bootstrap';
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import './Login.css'
import hash from "../hash";

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            token: null,
        }
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
    
        if (_token) {
          // Set token
          this.setState({
            token: _token
          });
        }
    }

    render() {
        return (
            <div className="Login">

                <Button href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                )}&response_type=token&show_dialog=true`}>Login to Spotify</Button>
            </div>
        );
    }
}