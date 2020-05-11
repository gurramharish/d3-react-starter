import React, { Component } from 'react';
import D3Chart from './D3Chart';
import SVGDefs from './svg-defs/svg-defs';

export default class ChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.chartInterval = null;
    this.chart = null;
  }

  componentDidMount() {
    new D3Chart(this.refs.chart);
  }

  componentWillUnmount() {
    if (this.chartInterval) {
      clearInterval(this.chartInterval);
    }
  }

  render() {
    return <div ref="chart"></div>;
  }
}
