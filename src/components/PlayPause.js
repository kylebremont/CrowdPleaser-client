import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import "./PlayPause.scss"


export default class PlayPause extends Component {
    render() {
      const { toggle, onClick } = this.props
      
      return(
        <Motion
          style={{scale: spring(toggle ? 1 : 0, [300, 30])}}
        >
          {({scale}) =>
            <button
              type="button"
              className="play-pause"
              onClick={onClick}
            >
              <span
                className="play-pause__playhead"
                style={{
                  transform: `scaleX(${1 - scale})`,
                  WebkitTransform: `scaleX(${1 - scale})`
                }}
              />
              <span
                className="play-pause__pausehead"
                style={{
                  transform: `scaleX(${scale})`,
                  WebkitTransform: `scaleX(${scale})`
                }}
              />
            </button>
          }
        </Motion>
      )
    }
  }
  