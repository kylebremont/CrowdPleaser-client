import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import logo from "./spotify.svg";
import "./App.css";
import Search from "./components/Search";
import Queue from "./components/Queue";
import Playback from "./components/Playback";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      loggedIn: false
    };
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>welcome to crowdpleaser</h1>
          {!this.state.loggedIn && (
            <div>
            <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                )}&response_type=token&show_dialog=true`}>Login to Spotify</a>
          </div>
          )}
          {this.state.loggedIn && (
          <div>
            <Playback></Playback>
            <div class="row">
              <div class="column">
                <Search
                  access_code={this.state.token}
                ></Search>
              </div>
              <div className="column">
                <Queue></Queue>
              </div>
            </div>
          </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;