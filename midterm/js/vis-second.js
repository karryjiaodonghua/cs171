//Adapted from http://bl.ocks.org/mbostock/3885211
const margin = {top: 20, right: 20, bottom: 50, left: 100},
  svgWidth = 500,
  svgHeight = 400,
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

var scaleX = d3.time.scale()
    .range([0, width]);

var scaleY = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(scaleX)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(scaleY)
    .orient("left")

var area = d3.svg.area()
    .x(d => scaleX(d.date))
    .y0(d => scaleY(d.y0))
    .y1(d => scaleY(d.y0 + d.y));

var stack = d3.layout.stack()
    .values(d => d.values);

var svg = d3.select("#svg-container-2").append("svg")
  .attr({
    width: svgWidth,
    height: svgHeight
  })
  .append("g")
  .attr({
    "transform": `translate(${margin.left},${margin.top})`
  })

d3.csv("data/global-funding-t.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = new Date(d.date);
    Object.keys(d).filter(x => x !== "date").forEach(key => {
      d[key] = Number(d[key])
    })
  });

  console.log(data)

  var sources = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, y: d[name]};
      })
    };
  }));

  sources.pop()

  console.log(sources)

  scaleX.domain(d3.extent(data, d => d.date));
  scaleY.domain([0, d3.max(data, d => d.Total)])

  var source = svg.selectAll(".source")
    .data(sources)
    .enter().append("g")
    .attr({
      class: "source"
    })

  source.append("path")
    .attr({
      class: "area",
      d: d => area(d.values)
    })
    .style("fill", d => color(d.name));

  var sourceLabels = svg.selectAll(".source-label")
    .data(sources)
    .enter().append("g")
    .attr({
      class: "source-label"
    })

  sourceLabels.append("text")
      .datum(d => {return {name: d.name, value: d.values[d.values.length - 1]}})
      .text(d => d.name)
      .attr({
        "text-anchor": "end",
        "alignment-baseline": "central",
        transform: d => `translate(${scaleX(d.value.date)},${scaleY(d.value.y0 + d.value.y / 2)})`
      })

  svg.append("g")
    .attr({
      class: "x axis",
      transform: `translate(0,${height})`
    })
    .call(xAxis);

  svg.append("g")
    .attr({
      class: "y axis"
    })
    .call(yAxis);

  svg.append("text")
    .attr({
      "text-anchor": "middle",
      "transform": `translate(${-margin.left/2},${height / 2})rotate(-90)`
    })
    .text("Donations (millions of USD)");

  svg.append("text")
    .attr({
      "text-anchor": "middle",
      "transform": `translate(${width / 2}, ${svgHeight - margin.bottom / 2})`
    })
    .text("Year")

});
