
// SVG Size
const WIDTH = 700,
		HEIGHT = 500,
    PADDING = 20;

var tryNumber = (x) => {
  var num = Number(x);
  return isNaN(num) ? x : num;
}

var objToNumbers = (obj, i) => {
  var newObj = {};
  Object.keys(obj).forEach(key => newObj[key] = tryNumber(obj[key]));
  return newObj;
}

var svg = d3.select("#chart-area").append("svg")
  .attr({
    width: WIDTH,
    height: HEIGHT
  })

var g = svg.append("g")
  .attr({
    transform: `translate(${PADDING}, ${PADDING})`
  });

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){

	// Analyze the dataset in the web console
  data = data.map(objToNumbers)
	console.log(data);
	console.log("Countries: " + data.length)

  var extIncome = d3.extent(data, d => d.Income);
  var extLE = d3.extent(data, d => d.LifeExpectancy);
  var scaleIncome = d3.scale.linear().domain(extIncome).range([0, WIDTH - PADDING])
  var scaleLE = d3.scale.linear().domain(extLE).range([HEIGHT-PADDING, 0])

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr({
      cx: d => scaleIncome(d.Income),
      cy: d => scaleLE(d.LifeExpectancy),
      r: 10,
      stroke: "black",
      fill: "blue",
      id: d => d.Country
    })

  var xAxis = d3.svg.axis()
    .scale(scaleIncome)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(scaleLE)
    .orient("left");

  svg.append("g")
    .attr({
      class: "axis x-axis",
      transform: `translate(0, ${HEIGHT - PADDING})`
    })
    .call(xAxis)
  svg.append("g")
    .attr({
      class: "axis y-axis",
      transform: `translate(${PADDING}, 0)`
    })
    .call(yAxis)
});
