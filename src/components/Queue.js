import React, { Component } from 'react';
import './Queue.css'

export default class Queue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: [],
        }
        this.enqueue = this.enqueue.bind(this);
        this.dequeue = this.dequeue.bind(this);
    }

    enqueue(song) {
        var queue = this.state.queue;
        if (queue.length === 0) {
            this.props.playSong(song);
        }
        queue.push(song);
        this.setState({queue});
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.queue.shift();
    }


    render() {
        return (
            <div>
                {this.state.queue !== undefined && this.state.queue.map((song, i) => {
                    if (i !== 0) {
                        return<div key={i} className="QueueItem">{song.name}</div>
                    }
                    return null;
                }
            )}
            </div>
        );
    }
};