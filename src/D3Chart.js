import * as d3 from 'd3';
const data = [20, 12, 30, 25, 13, 60];
export default class D3Chart {
  constructor(element) {
    console.log('Hi Chart invoked!!');
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', 500)
      .attr('height', 500);

    let rects = svg.selectAll('rect').data(data);
    rects
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 100)
      .attr('y', 50)
      .attr('width', 50)
      .attr('height', (d) => d * 10)
      .attr('fill', 'url(#Gradient1)');
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
