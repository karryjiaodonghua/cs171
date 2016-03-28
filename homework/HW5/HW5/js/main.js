const SVG_WIDTH = 640,
  SVG_HEIGHT = 360,
  MARGIN_TOP = 40,
  MARGIN_LEFT = 100,
  MARGIN_RIGHT = 40,
  MARGIN_BOTTOM = 60,
  WIDTH = SVG_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
  HEIGHT = SVG_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM,
  ANIM = 500;


var svg = d3.select("#chart-area").append("svg")
  .attr({
    width: SVG_WIDTH,
    height: SVG_HEIGHT
  })

var main_g = svg.append("g")
  .attr({
    transform: `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`
  })


var strToDate = d => {
  var date = new Date(d);
  return date == "Invalid Date" ? null : date;
}


var strToNum = n => {
  var number = Number(n);
  return isNaN(number) ? null : number;
}


var tryConvert = (functions, val) => {
  functions.some(f => {
    var converted = f(val);
    if (converted !== null) {
      val = converted;
      return true;
    }
  })
  return val;
}

var unstringify = (functions, obj) => {
  var newObj = {};
  Object.keys(obj).forEach(key => newObj[key] = tryConvert(functions, obj[key]));
  return newObj;
}

var x_scale = d3.scale.linear().range([0, WIDTH]);
var x_axis = d3.svg.axis().orient("bottom");
var y_scale = d3.scale.linear().range([HEIGHT, 0]);
var y_axis = d3.svg.axis().orient("left");
var y_prop;

var DATA, circles, line, d3tip;

d3.csv("/data.csv", function(error, data) {
  DATA = data.map(unstringify.bind(null, [strToNum, strToDate]));

  circles = main_g.selectAll("circles");

  line = d3.svg.line()
    .x(d => x_scale(d.YEAR))
    .y(d => y_scale(d.GOALS))
    .interpolate("linear");

  main_g.append("svg:path")
    .attr({
      class: "line"
    });

  main_g.append("g")
    .attr({
      class: "axis x-axis",
      transform: `translate(0,${HEIGHT})`
    })
  main_g.append("g")
    .attr({
      class: "axis y-axis"
    })
    .call(y_axis);
  main_g.append("text")
    .attr({
      class: "label x-label",
      x: WIDTH / 2,
      y: HEIGHT + 50
    })
    .text("Year");
  main_g.append("text")
    .attr({
      class: "label y-label",
      x: -HEIGHT / 2,
      y: -50,
      dy: "1em",
      transform: "rotate(-90)"
    })
    .text("Goals");

  d3tip = d3.tip()
    .attr({
      class: "d3-tip"
    })
    .html(d => `${d.EDITION}, ${d[y_prop]}`)
  main_g.call(d3tip)

  draw();
});


function draw() {

  var currType = d3.select("#data-type").property("value");
  y_prop = currType.toUpperCase();
  console.log(y_prop)

  var circleData = DATA;
  var dates = DATA.map(d => d.YEAR);
  var vals = DATA.map(d => d[y_prop]);
  var dateExt = d3.extent(dates);
  var dateMin = $("#date_min").val() || 1
  var dateMax = $("#date_max").val() || Number.MAX_VALUE
  dateExt[0] = Math.max(dateExt[0], dateMin)
  dateExt[1] = Math.min(dateExt[1], dateMax)

  circleData = circleData.filter(d => d.YEAR >= dateExt[0] && d.YEAR <= dateExt[1])

  var valMin = d3.min(vals);
  var valMax = d3.max(vals);

  x_scale.domain(dateExt);
  y_scale.domain([0, valMax]);

  x_axis.scale(x_scale);
  y_axis.scale(y_scale);

  main_g.select("g.x-axis").transition().duration(ANIM).call(x_axis);
  main_g.select("g.y-axis").transition().duration(ANIM).call(y_axis);
  main_g.select(".label.y-label").text(prettyPrint(currType));

  line.y(d => y_scale(d[y_prop]));
  main_g.select("path.line").transition().duration(ANIM).attr("d", line(circleData))

  circles = circles.data(circleData, d => d.YEAR)
  circles.enter()
    .append("circle")
    .attr("class", "tooltip-circle")
    .on('mouseover', d3tip.show)
    .on('mouseout', d3tip.hide)
    .on("click", showData);
  circles.exit().remove();
  circles.transition().duration(ANIM)
    .attr("cx", d => x_scale(d.YEAR) )
    .attr("cy", d => y_scale(d[y_prop]))
    .attr("r", 10);
}

var showData = d => {
  $("#game-data").html(`
    <h3>${d.EDITION}</h3>
    <table class="table table-striped table-hover table-bordered">
    <tr><td>Winner</td><td>${d.WINNER}</td></tr>
    <tr><td>Location</td><td>${d.LOCATION}</td></tr>
    <tr><td>Matches</td><td>${d.MATCHES}</td></tr>
    <tr><td>Goals</td><td>${d.GOALS}</td></tr>
    <tr><td>Average Goals</td><td>${d.AVERAGE_GOALS}</td></tr>
    <tr><td>Teams</td><td>${d.TEAMS}</td></tr>
    <tr><td>Average Attendance</td><td>${d.AVERAGE_ATTENDANCE}</td></tr>
  `);
}


var prettyPrint = x => x.split("_").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ")

$(function() {
  $("#update").click(draw)
})
