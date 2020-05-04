import React, { Component } from 'react';
import { clientId, secret } from '../config';

export default class Playback extends Component {
    constructor(props) {
        super(props);
    
        // this.state = {
        //     item: {
        //       album: {
        //         images: [{ url: "" }]
        //       },
        //       name: "",
        //       artists: [{ name: "" }],
        //       duration_ms: 0
        //     },
        //     is_playing: "Paused",
        //     progress_ms: 0
        //   };
    }

    render() {

        // const backgroundStyles = {
        //     backgroundImage:`url(${
        //       this.props.item.album.images[0].url
        //     })`,
        //   };
        
        //   const progressBarStyles = {
        //     width: (this.props.progress_ms * 100 / this.props.item.duration_ms) + '%'
        //   };
        
        return (
            <div className="App">
            {/* <div className="main-wrapper">
              <div className="now-playing__img">
                <img src={this.props.item.album.images[0].url} />
              </div>
              <div className="now-playing__side">
                <div className="now-playing__name">{this.props.item.name}</div>
                <div className="now-playing__artist">
                  {this.props.item.artists[0].name}
                </div>
                <div className="now-playing__status">
                  {this.props.is_playing ? "Playing" : "Paused"}
                </div>
                <div className="progress">
                  <div className="progress__bar" style={progressBarStyles} />
                </div>
              </div>
              <div className="background" style={backgroundStyles} />{" "}
            </div> */}
          </div>
        );
    }
}