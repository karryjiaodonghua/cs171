var svg = d3.select("svg")
var height = 600
var width = 1000
var projection = d3.geo.mercator  ()
  .translate([width/2, height/2])

var path = d3.geo.path().projection(projection)

queue()
  .defer(d3.json, "/data/world-110m.json")
  .defer(d3.json, "/data/airports.json")
  .await((error, data, airports) => {
    var countries = topojson.feature(data, data.objects.countries).features
    svg.selectAll("path")
      .data(countries)
      .enter()
      .append("path")
      .attr({
        d: path
      })

    var node = svg.selectAll(".node")
      .data(airports.nodes)
      .enter()
      .append("circle")
      .attr({
        class: d => `node ${d.name}`,
        r: 5,
        fill: d => d.country === "United States" ? "blue" : "red",
        transform: d => `translate(${projection([d.longitude, d.latitude])})`
      })

    var link = svg.selectAll(".link")
      .data(airports.links)
      .enter()
      .append("line")
      .attr({
        class: "link",
        stroke: "green",
        x1: d => projection([airports.nodes[d.source].longitude, airports.nodes[d.source].latitude])[0],
        y1: d => projection([airports.nodes[d.source].longitude, airports.nodes[d.source].latitude])[1],
        x2: d => projection([airports.nodes[d.target].longitude, airports.nodes[d.target].latitude])[0],
        y2: d => projection([airports.nodes[d.target].longitude, airports.nodes[d.target].latitude])[1]
      })
  })
