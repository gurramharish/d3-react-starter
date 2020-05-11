import * as d3 from 'd3';
const url = 'https://udemy-react-d3.firebaseio.com/tallest_men.json';
const margin = { top: 10, bottom: 50, left: 50, right: 10 };
const WIDTH = 800 - margin.left - margin.right;
const HEIGHT = 500 - margin.top - margin.bottom;
export default class D3Chart {
  constructor(element) {
    console.log('Hi Chart invoked!!');
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', WIDTH + margin.left + margin.right)
      .attr('height', HEIGHT + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    d3.json(url).then((data) => {
      const max = d3.max(data, (d) => {
        return d.height;
      });
      const min = d3.min(data, (d) => d.height);
      const y = d3.scaleLinear().domain([min, max]).range([HEIGHT, 0]);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, WIDTH])
        .padding(0.4);

      const xAxisCall = d3.axisBottom(x);
      svg
        .append('g')
        .attr('transform', `translate(0, ${HEIGHT})`)
        .call(xAxisCall);
      const yAxisCall = d3.axisLeft(y);
      svg.append('g').call(yAxisCall);

      let rects = svg.selectAll('rect').data(data);

      rects
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.name))
        .attr('y', (d) => y(d.height))
        .attr('width', x.bandwidth)
        .attr('height', (d) => HEIGHT - y(d.height))
        .attr('fill', 'grey');
    });

    // data.forEach((d, i) => {
    //   svg
    //     .append('rect')
    //     .attr('x', i * 100)
    //     .attr('y', 50)
    //     .attr('width', 50)
    //     .attr('height', d)
    //     .attr('fill', 'url(#Gradient1)');
    // });
  }
}
