import React, { Component } from 'react';

export default class Song extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            name: props.data.name,
            artist: props.data.artist,
            uri: props.data.uri,
            duration: props.data.duration_ms
        }
    }

    render() {
        console.log(this.state.name)
        return (
            <div>
                {this.state.name + ", " + this.state.artist }
             </div>
        );
    }
}