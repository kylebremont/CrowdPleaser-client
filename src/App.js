import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import "./App.css";
import Search from "./components/Search";
import Queue from "./components/Queue";
import Playback from "./components/Playback";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      loggedIn: false,
      songInfo: null,
    };

    this.queueElement = React.createRef();
    this.playbackElement = React.createRef();

    this.playSong = this.playSong.bind(this);

    this.addToQueue = this.addToQueue.bind(this);
    this.requestSong = this.requestSong.bind(this);
  }

  componentDidMount() {
    let _token = hash.access_token;
   
    if (_token) {
      
      // Set token
      this.setState({
        token: _token,
        loggedIn:  true
      });
    }
  }

  addToQueue(songInfo) {
    this.queueElement.current.enqueue(songInfo);
  }

  requestSong() {
    this.queueElement.current.dequeue();
  }

  playSong(song) {
    this.playbackElement.current.setSong(song)
  }

  render() {
    return (
      <div className="App">
        <div>
        {!this.state.loggedIn && (
            <div>
              <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                )}&response_type=token&show_dialog=true`}>Login to Spotify</a>
          </div>
          )}
          {this.state.loggedIn && (
          <div>
            <Playback ref={this.playbackElement} access_code={this.state.token} requestSong={this.requestSong}></Playback>
            <div className="row">
              <div className="column">
                <Search
                  access_code={this.state.token}
                  addToQueue={this.addToQueue}
                ></Search>
              </div>
              <div className="column">
                <Queue ref={this.queueElement} playSong={this.playSong}></Queue>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;