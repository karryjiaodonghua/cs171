

// --> CREATE SVG DRAWING AREA

const WIDTH = 640,
  HEIGHT = 400,
  PADDING = 20

const strToNum = n => {
  var number = Number(n);
  return isNaN(number) ? n : number;
}

var processData = (obj) => {
  var newObj = {};
  Object.keys(obj).forEach(key => newObj[key] = strToNum(obj[key]));
  return newObj;
}

var currentFeature = "UN_population";

// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-malaria-2015.csv")
  .await(function(error, mapTopJson, malariaDataCsv){


    // --> PROCESS DATA

    var data = processData(malariaDataCsv);


    var scale = d3.scale.quantize()
      .domain(0, 100)
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var map = d3.map();
    var projection = d3.geo.orthographic()
      .translate([WIDTH / 4, HEIGHT / 2])
      .scale(300)

    var path = d3.geo.path()
      .projection(projection);

    var svg = d3.select("#svg-container-1").append("svg")
      .attr({
        width: WIDTH,
        height: HEIGHT
      })

    svg.append("g")
      .attr({
        class: "countries",
        x: 0,
        y: 0
      })
      .selectAll("path")
      .data(topojson.feature(mapTopJson, mapTopJson.objects.collection).features)
      .enter()
      .append("path")
      .attr({
        class: d => scale(map.get(d.adm0_a3_is)),
        d: path
      })


    // Update choropleth
    updateChoropleth();
  });


function updateChoropleth() {

  // --> Choropleth implementation

}



// var width = 960,
//     height = 600;
//
// var rateById = d3.map();
//
// var quantize = d3.scale.quantize()
//     .domain([0, .15])
//     .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
//
// var projection = d3.geo.albersUsa()
//     .scale(1280)
//     .translate([width / 2, height / 2]);
//
// var path = d3.geo.path()
//     .projection(projection);
//
// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);
//
// queue()
//     .defer(d3.json, "/mbostock/raw/4090846/us.json")
//     .defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
//     .await(ready);
//
// function ready(error, us) {
//   if (error) throw error;
//
//   svg.append("g")
//       .attr("class", "counties")
//     .selectAll("path")
//       .data(topojson.feature(us, us.objects.counties).features)
//     .enter().append("path")
//       .attr("class", function(d) { return quantize(rateById.get(d.id)); })
//       .attr("d", path);
//
//   svg.append("path")
//       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//       .attr("class", "states")
//       .attr("d", path);
// }
//
// d3.select(self.frameElement).style("height", height + "px");