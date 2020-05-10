import React, { Component } from 'react';
import './Queue.css'

export default class Queue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: [],
            isPlaying: false,
        }
        this.enqueue = this.enqueue.bind(this);
        this.dequeue = this.dequeue.bind(this);
    }

    enqueue(song) {
        var queue = this.state.queue;
        // first time song is selected, start playing and don't add to queue
        if (!this.state.isPlaying) {
            this.setState({isPlaying: true}, () => this.props.playSong(song));
        } else {
            queue.push(song);
            this.setState({queue});
        } 
    }

    dequeue() {
        if (this.state.queue.length === 0) {
            // if there is nothing in the queue, set isPlaying to false for next song choice
            this.setState({isPlaying: false});
        } else {
            var queue = this.state.queue;
            var upNext = queue.shift();
            this.setState({queue})
            console.log(upNext)
            this.props.playSong(upNext)
        }
    }



    render() {
        return (
            <div>
                {this.state.queue !== undefined && this.state.queue.map((song, i) => {
                    return (
                        <div key={i} className="row">
                            <div className="track__queue">
                                <span className="order__number">{i+1}.</span>
                                <span className="track__info">
                                    <span className="track__cover" style={{backgroundImage: 'url('+song.image+')'}}></span>
                                    <span className="track__summary">
                                        <span className="track__artist">{song.artist}</span>
                                        <span className="track__separator"></span>
                                        <span className="QueueItem">{song.name}</span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    )
                }
            )}
            </div>
        );
    }
};