import React, { Component } from 'react';
import D3Chart from './D3Chart';
import SVGDefs from './svg-defs/svg-defs';

export default class ChartWrapper extends Component {
  componentDidMount() {
    new D3Chart(this.refs.chart);
  }
  render() {
    return (
      <div ref="chart">
        <SVGDefs />
      </div>
    );
  }
}
