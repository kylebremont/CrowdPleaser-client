import React, { Component } from 'react';
import './SearchResult.css'

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
            <div style={{cursor: "pointer"}} onClick={() => { this.props.getSongUri(this.state) } }>
                <div className="row">
                    <div className="column-1">
                        <img src={this.state.image} alt="album cover" className="imgz"/>
                    </div>
                    <div className="column-2">
                        <div className="title">
                            {this.state.name} 
                        </div>
                        <br></br>
                        <div className="artist">
                            {this.state.artist}
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}