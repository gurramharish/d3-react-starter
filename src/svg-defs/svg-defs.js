import React, { Component } from 'react';
import './svg.css';

export default class SVGDefs extends Component {
  render() {
    return (
      <div>
        <svg width="1" height="1">
          <defs>
            <linearGradient id="Gradient1">
              <stop className="stop1" offset="0%" />
              <stop className="stop2" offset="50%" />
              <stop className="stop3" offset="100%" />
            </linearGradient>
            <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="red" />
              <stop offset="50%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="blue" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
}
