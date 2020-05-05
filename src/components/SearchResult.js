import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class SearchResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.data.name,
            artist: props.data.artist,
            uri: props.data.uri,
            image: props.data.image,
            duration: props.data.duration
        }
    }

    render() {
        return (
            <div>
                <Button onClick={() => { this.props.getSongUri(this.state) } }>{this.state.name + ", " + this.state.artist}</Button>
             </div>
        );
    }
}