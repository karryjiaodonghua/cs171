var width = 400,
  height = 400;

var padding = 40;

var svg = d3.select("#chart-area").append("svg")
  .attr("width", width)
  .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT
var force = d3.layout.force()
  .gravity(50)
  .size(width, height)


// Load data
d3.json("data/airports.json", data => {

  var longExtent = d3.extent(data.nodes.map(d => d.longitude))
  var latExtent = d3.extent(data.nodes.map(d => d.latitude))
  var xScale = d3.scale.linear().domain(longExtent).range([0 + padding, width - padding])
  var yScale = d3.scale.linear().domain(latExtent).range([height - padding, 0 + padding])

  // 2a) DEFINE 'NODES' AND 'EDGES'
  force.nodes(data.nodes).links(data.links)


  force.start()

  var node = svg.selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr({
      class: d => `node ${d.name}`,
      r: 5,
      fill: d => d.country === "United States" ? "blue" : "red"
    })
  node.append("title")
    .text(function(d) { return d.name; });
  var link = svg.selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .attr({
      class: "link",
      stroke: "blue"
    })
  force.on("tick", () => {
    console.log("TICK")
    node.attr({
      cx: d => xScale(d.longitude),
      cy: d => yScale(d.latitude),
    })
    link.attr({
      x1: d => xScale(d.source.longitude),
      y1: d => yScale(d.source.latitude),
      x2: d => xScale(d.target.longitude),
      y2: d => yScale(d.target.latitude)
    })
  })


  // 2b) START RUNNING THE SIMULATION

  // 3) DRAW THE LINKS (SVG LINE)

  // 4) DRAW THE NODES (SVG CIRCLE)

  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

});
