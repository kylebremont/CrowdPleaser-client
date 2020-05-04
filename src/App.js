import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import logo from "./spotify.svg";
import "./App.css";
import Search from "./components/Search";
import Queue from "./components/Queue";

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
          {!this.state.loggedIn && (
            <div>
            <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                )}&response_type=token&show_dialog=true`}>Login to Spotify</a>
          </div>
          )}
          {this.state.loggedIn && (
            <div>

            <Search
              access_code={this.state.token}
            ></Search>
            <Queue></Queue>
          </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;