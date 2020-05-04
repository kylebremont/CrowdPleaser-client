import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

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
        // console.log(this.state.name)
        return (
            <div>
                <Button onClick={() => { this.props.getSongUri(this.state.uri) } }>{this.state.name + ", " + this.state.artist}</Button>
                {/* {this.state.name + ", " + this.state.artist + ", " + this.state.uri } */}
             </div>
        );
    }
}