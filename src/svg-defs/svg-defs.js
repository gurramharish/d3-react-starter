import React, { Component } from 'react';
import './svg.css';

export default class SVGDefs extends Component {
  render() {
    return (
      <div>
        <svg>
          <defs>
            <linearGradient id="Gradient1">
              <stop class="stop1" offset="0%" />
              <stop class="stop2" offset="50%" />
              <stop class="stop3" offset="100%" />
            </linearGradient>
            <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="red" />
              <stop offset="50%" stop-color="black" stop-opacity="0" />
              <stop offset="100%" stop-color="blue" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
}
