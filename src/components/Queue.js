import React, { Component } from 'react';
import Song from './Song';


export default class Queue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: [],
        }
    }

    enqueue(song) {
        this.state.queue.push(song);
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.queue.shift();
    }


    render() {

        return (
            <div>buttsoup</div>
        );
    }
};