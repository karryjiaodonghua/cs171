const SVG_W = 500;
const SVG_H = 500;
const BARCTR = SVG_W / 2;
const TXTPAD = 10;
const BARRATIO = 0.6;

var tryNumber = (x) => {
  var num = Number(x);
  return isNaN(num) ? x : num;
}

var objToNumbers = (obj) => {
  var newObj = {};
  Object.keys(obj).forEach(key => newObj[key] = tryNumber(obj[key]));
  return newObj;
}

var capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1)

var showData = (data) => {
  d3.select("#leftcol").classed("rightExists", true)

  var rightcol = d3.select("#rightcol");
  rightcol.selectAll("*").remove();

  rightcol.append("h3")
    .text(data.building)
    .attr({
      class: "text-center"
    });

  rightcol.append("img")
    .attr({
      class: "col-xs-12 col-sm-6",
      src: "/img/" + data.image
    })

  var table = rightcol.append("div")
    .attr({
      class: "col-xs-12 col-sm-6"
    })
    .append("table")
    .attr({
      class: "table table-hover table-striped table-bordered col-xs-12 col-sm-6"
    })
  var body = table.append("tbody")

  var props = ["country", "city", "height_m", "floors", "completed"]
  props.forEach(prop => {
    var row = body.append("tr");
    row.append("td").text(capitalize(prop.replace(/height_m/, "Height (m)")));
    row.append("td").text(data[prop]);
  })
}

d3.csv('/buildings.csv', (data) => {
  data = data.map(objToNumbers)
  data = data.sort((a,b) => b.height_m - a.height_m)

  const VSPACE = SVG_H / data.length;
  const WSCALE = (SVG_W - BARCTR) / data[0].height_m

  var svg = d3.select("#leftcol").append("svg")
    .attr("width", SVG_W)
    .attr("height", SVG_H)

  svg.selectAll("text.bd-name")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.building)
    .attr({
      class: "bd-name",
      x: BARCTR - TXTPAD,
      y: (d, i) => VSPACE * i,
      dy: VSPACE / 2
    })
    .on("click", showData)

  svg.selectAll("rect.bd-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr({
      class: "bd-bar",
      x: BARCTR,
      y: (d, i) => VSPACE * i + (1 - BARRATIO) / 2 * VSPACE,
      height: VSPACE * BARRATIO,
      width: d => d.height_m * WSCALE
    })
    .on("click", showData)

  svg.selectAll("text.bd-height")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.height_m)
    .attr({
      class: "bd-height",
      x: d => d.height_m * WSCALE + BARCTR - TXTPAD,
      y: (d, i) => VSPACE * i,
      dy: VSPACE / 2
    })
    .on("click", showData)

});
