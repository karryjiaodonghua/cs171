

// --> CREATE SVG DRAWING AREA

const WIDTH = 500,
  HEIGHT = 400,
  PADDING = 20

var tip, path1,
  data1 = {};

const strToNum = n => {
  var number = Number(n);
  return isNaN(number) ? n : number;
}

const processData = (obj) => {
  var newObj = {};
  Object.keys(obj).forEach(key => newObj[key] = strToNum(obj[key]));
  return newObj;
}

const mapToData = (d) => data1[d.properties.adm0_a3_is]

var currentFeature = "UN_population";

// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-malaria-2015.csv")
  .await(function(error, mapTopJson, malariaDataCsv){


    // --> PROCESS DATA
    data1 = {};
    malariaDataCsv.map(processData).filter(d => d.WHO_region === "African").forEach( d => {
      data1[d.Code] = d;
    })

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

    tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
    svg.call(tip)

    path1 = svg.append("g")
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
        d: path,
        stroke: "black"
      })




    // Update choropleth
    updateChoropleth();
  });


function updateChoropleth() {

  // --> Choropleth implementation
  var scale = d3.scale.quantize()
    .domain(d3.extent(Object.keys(data1).map(d => data1[d][currentFeature])))
    .range(d3.range(9).map(i => `color-${i}`));

  path1.attr({
    class: d => {
      var countryData = mapToData(d);
      var feature = countryData === undefined ? 0 : countryData[currentFeature];
      return scale(feature === undefined || feature === "N/A" ? 0 : feature)
    }
  })

  tip.html(d => `<b>${mapToData(d).Country}</b><br/>${mapToData(d)[currentFeature]}`)
  path1.on('mouseover', tip.show)
  .on('mouseout', tip.hide)

}

document.getElementById("current-feature").addEventListener("change", function(e) {
  currentFeature = e.target.value
  updateChoropleth();
})
