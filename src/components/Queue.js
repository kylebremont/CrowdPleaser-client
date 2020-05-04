import React, { Component } from 'react';
import Song from './Song';


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
        console.log(this.state.queue);
        return (
            <div>buttsoup</div>
        );
    }
};