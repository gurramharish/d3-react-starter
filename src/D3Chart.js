import * as d3 from 'd3';
export default class D3Chart {
  constructor(element, data) {
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
      .attr('height', (d) => d.age * 10)
      .attr('fill', (d) => {
        if (d.age > 10) {
          return 'red';
        } else {
          return 'green';
        }
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

  updateData(data) {}
}
