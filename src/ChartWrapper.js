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
    const url = 'https://udemy-react-d3.firebaseio.com/ages.json';
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log('Data from URL :: ', data);
        if (!this.chart) {
          this.chart = new D3Chart(this.refs.chart, data);
        } else {
          this.chart.updateData(data);
        }
      });

    // this.chartInterval = setInterval(() => {});
  }

  componentWillUnmount() {
    if (this.chartInterval) {
      clearInterval(this.chartInterval);
    }
  }

  render() {
    return (
      <div ref="chart">
        <SVGDefs />
      </div>
    );
  }
}
