import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import logo from "./logo.svg";
import "./App.css";
import Playback from "./components/Playback";
import Login from "./components/Login"

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      loggedIn: false
    };
  }

  updateToken(token) {
    this.setState({token})
  }

  componentDidMount() {
    // Set token
    // let _token = hash.access_token;
    
    // if (_token) {
    //   // Set token
    //   this.setState({
    //     token: _token
    //   });
    // }
  }

  // getCurrentlyPlaying(token) {
  //   // Make a call using the token
  //   $.ajax({
  //     url: "https://api.spotify.com/v1/me/player",
  //     type: "GET",
  //     beforeSend: xhr => {
  //       xhr.setRequestHeader("Authorization", "Bearer " + token);
  //     },
  //     success: data => {
  //       this.setState({
  //         item: data.item,
  //         is_playing: data.is_playing,
  //         progress_ms: data.progress_ms
  //       });
  //     }
  //   });
  // }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* {!this.state.loggedIn && (
            <div>
            <Login></Login>
          </div>
          )}
          {this.state.loggedIn && (
            <div>
            <Playback
              access_code={this.state.token}
            ></Playback>
          </div>
          )} */}

          <Playback
            access_code="BQCkDkccOYsOme0sbg70CnQWmp1TWBAzzqvLiTGvqaAqtGlqaK04y-V5Xk_e-cJlciZUdzV0Z9uTJRa_kizjg8gYwdH6i2aInmFzJ950iKvPzKeb2aHZiQbYJevKhtGON_5SwlkIA3Oo_MjrxyoRnjb5chqY-Axa4l1D"
          ></Playback>
        </header>
      </div>
    );
  }
}

export default App;