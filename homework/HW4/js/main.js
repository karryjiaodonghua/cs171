const MARGIN = {
  TOP: 60,
  LEFT: 80,
  RIGHT: 60,
  BOTTOM: 80
};
const SVGHEIGHT = 500;
const SVGWIDTH = 500;
const HEIGHT = SVGHEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
const WIDTH = SVGWIDTH - MARGIN.LEFT - MARGIN.RIGHT;

// Convert a string to a date
var strToDate = d => {
  var date = new Date(d);
  return date == "Invalid Date" ? null : date;
}

// Convert a string to a number
var strToNum = n => {
  var number = Number(n);
  return isNaN(number) ? null : number;
}

// These next two functions try to convert an object's strings into numbers and dates
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

d3.csv('/data.csv', data => {
  data = data.map(unstringify.bind(null, [strToNum, strToDate]));
  console.log(data)

  var l_svg = d3.select("#left").append("svg")
    .attr({
      height: SVGHEIGHT,
      width: SVGWIDTH
    });
  var l_scaleX = d3.time.scale().domain(d3.extent(data, d => d.date)).range([0, WIDTH]);
  var l_maxY = d3.max(data, d => d.population);
  var l_scaleY = d3.scale.linear().domain([0, l_maxY]).range([HEIGHT, 0]);

  var area = d3.svg.area()
    .x(d => l_scaleX(d.date))
    .y0(HEIGHT)
    .y1(d => l_scaleY(d.population))
  var l_g = l_svg.append("g")
    .attr({
      transform: `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`,
    })
  var shaded = l_g.append("path")
    .datum(data)
    .attr({
      class: "area",
      d: area
    })
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var l_xAxis = d3.svg.axis()
    .scale(l_scaleX)
    .orient("bottom")
    .ticks(6)
    .tickSize(3)
    .tickFormat(d => `${monthNames[d.getMonth()]} ${(d.getFullYear())}`);
  var l_yAxis = d3.svg.axis()
    .scale(l_scaleY)
    .orient("left")

  l_svg.append("g")
    .attr({
      class: "axis x-axis",
      transform: `translate(${MARGIN.LEFT}, ${SVGHEIGHT - MARGIN.BOTTOM})`
    })
    .call(l_xAxis)


  l_svg.append("g")
    .attr({
      class: "axis y-axis",
      transform: `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`
    })
    .call(l_yAxis);

  l_svg.selectAll(".x-axis text")
    .attr({
      transform: function() {
        return `translate(${this.getBBox().height * -2}, ${this.getBBox().height})rotate(-20)`
      }
    })

  l_svg.append("text")
    .text("Za'atari Refugee Camp Population")
    .attr({
      x: SVGWIDTH / 2,
      y: MARGIN.TOP / 2,
      "text-anchor": "middle"
    })
  l_svg.append("text")
    .text("Month")
    .attr({
      x: SVGWIDTH / 2,
      y: SVGHEIGHT - MARGIN.BOTTOM / 3,
      "text-anchor": "middle"
    })
  l_svg.append("text")
    .text("Population")
    .attr({
      x: -SVGHEIGHT / 2,
      y: MARGIN.TOP / 2,
      "text-anchor": "middle",
      class: "rotate"
    })

  var shelterTypes = [{
    type: "Caravan",
    percent: 79.68
  }, {
    type: "Combination",
    percent: 10.81
  }, {
    type: "Tent",
    percent: 9.51
  }]

  var r_svg = d3.select("#right").append("svg")
    .attr({
      height: SVGHEIGHT,
      width: SVGWIDTH
    })
  var r_scaleX = d3.scale.ordinal()
    .domain(shelterTypes.map(s => s.type))
    .rangeBands([0, WIDTH])
  var r_scaleY = d3.scale.linear()
    .domain([0, 100])
    .range([HEIGHT, 0])

  var r_g = r_svg.append("g")
    .attr({
      transform: `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`,
    })

  var WDIST = (WIDTH / shelterTypes.length);

  r_g.selectAll("rect")
    .data(shelterTypes)
    .enter()
    .append("rect")
    .attr({
      class: "bar",
      x: d => r_scaleX(d.type) + WDIST / 6,
      height: d => HEIGHT - r_scaleY(d.percent),
      y: d => r_scaleY(d.percent),
      width: 2 / 3 * WDIST
    })
  r_g.selectAll("text")
    .data(shelterTypes)
    .enter()
    .append("text")
    .text(d => d.percent.toFixed(2))
    .attr({
      class: "bartext",
      x: d => r_scaleX(d.type) + WDIST / 2,
      y: d => r_scaleY(d.percent) - 3,
      "text-anchor": "middle"
    })

  var r_xAxis = d3.svg.axis()
    .scale(r_scaleX)
    .orient("bottom")
    .ticks(4)
    .tickSize(3)
  var r_yAxis = d3.svg.axis()
    .scale(r_scaleY)
    .orient("left")

  r_svg.append("g")
    .attr({
      class: "axis x-axis",
      transform: `translate(${MARGIN.LEFT}, ${SVGHEIGHT - MARGIN.BOTTOM})`
    })
    .call(r_xAxis)


  r_svg.append("g")
    .attr({
      class: "axis y-axis",
      transform: `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`
    })
    .call(r_yAxis);

  r_svg.selectAll(".x-axis text")

  r_svg.append("text")
    .text("Shelter Types by Occupation Percentage")
    .attr({
      x: SVGWIDTH / 2,
      y: MARGIN.TOP / 2,
      "text-anchor": "middle"
    })
  r_svg.append("text")
    .text("Month")
    .attr({
      x: SVGWIDTH / 2,
      y: SVGHEIGHT - MARGIN.BOTTOM / 3,
      "text-anchor": "middle"
    })
  r_svg.append("text")
    .text("Population")
    .attr({
      x: -SVGHEIGHT / 2,
      y: MARGIN.TOP / 2,
      "text-anchor": "middle",
      class: "rotate"
    })

  var valueline = d3.svg.line()
    .x(d => l_scaleX(d.date))
    .y(0);
  var l_lineg = l_svg.append("g");
  var l_focusg = l_svg.append("g")
    .attr({
      class: "hiddeng"
    })
  l_lineg.append("path")
    .attr("class", "line")
    .attr({
      class: "line",
      d: valueline(data)
    })
  l_svg.append("rect")
    .attr({
      width: WIDTH,
      height: HEIGHT,
      class: "capturerect",
      transform: `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`
    })
    .on("mouseover", function() {
      l_focusg.classed("hiddeng", false)
    })
    .on("mouseout", function() {
      l_focusg.classed("hiddeng", true)
    })
    .on("mousemove", function() {
      var x = l_scaleX.invert(d3.mouse(this)[0]);
      var getDateRank = x => d3.bisector(d => d.date).left(data, x, 1);

      var dateRank = getDateRank(x);
      var date = x - data[dateRank - 1].date > data[dateRank].date - x ? data[dateRank] : data[dateRank - 1];

      l_focusg.select("text.y1")
        .attr("transform", `translate(${l_scaleX(date.date) + MARGIN.LEFT}, ${l_scaleY(date.population)})`)
        .text(`Population: ${date.population}`);
      l_focusg.select("text.y2")
        .attr("transform", `translate(${l_scaleX(date.date) + MARGIN.LEFT}, ${l_scaleY(date.population)})`)
        .text(`Population: ${date.population}`);
      l_focusg.select("text.y3")
        .attr("transform", `translate(${l_scaleX(date.date) + MARGIN.LEFT}, ${l_scaleY(date.population)})`)
        .text(dateString(date.date));
      l_focusg.select("text.y4")
        .attr("transform", `translate(${l_scaleX(date.date) + MARGIN.LEFT}, ${l_scaleY(date.population)})`)
        .text(dateString(date.date));
      l_focusg.select(".xline")
        .attr("transform", `translate(${l_scaleX(date.date) + MARGIN.LEFT}, ${l_scaleY(date.population)})`)
        .attr("y2", HEIGHT - l_scaleY(date.population));
    })

  var dateString = d3.time.format("%b. %d");

  l_focusg.append("line")
    .attr({
      class: "xline",
      y1: 0,
      y2: HEIGHT,
    })

  l_focusg.append("text")
    .attr("class", "y2")
    .attr("dx", 8)
    .attr("dy", "-.3em");
  l_focusg.append("text")
    .attr("class", "y4")
    .attr("dx", 8)
    .attr("dy", "1em");


})

$(function() {
  $("#update").click(draw);
})
