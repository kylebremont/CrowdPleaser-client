import React, { Component } from 'react';
import './Queue.css'
import SearchResult from './SearchResult';


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
                {this.state.queue !== undefined && this.state.queue.map((song) => {
                return<div className="QueueItem">{song.name}</div>
            })}</div>
        );
    }
};