d3.select("#main").append("div").text("Dynamic Content")


var svg2 = d3.select("#main").append("svg").attr("id","activity-2").attr("width","500px").attr("height","500px")
var sandwiches = [
   { name: "Thesis", price: 7.95, size: "large" },
   { name: "Dissertation", price: 8.95, size: "large" },
   { name: "Highlander", price: 6.50, size: "small" },
   { name: "Just Tuna", price: 6.50, size: "small" },
   { name: "So-La", price: 7.95, size: "large" },
   { name: "Special", price: 12.50, size: "small" }
];

var cRadius = 20
var colorCheap = "#8CDB92"
var colorExp = "#FFFF82"

svg2.selectAll("circle")
  .data(sandwiches)
  .enter()
  .append("circle")
  .attr("fill", (d) => d.price > 7 ? colorExp : colorCheap)
  .attr("r", (d) => cRadius * (d.size === "large" ? Math.pow(2,0.5) : 1))
  .attr("cy", 50)
  .attr("cx", function(d, index) {
      return 60 + (index * 60);
  })
  .attr('stroke', 'black')
  ;


d3.csv('http://www.cs171.org/2016/assets/scripts/lab3/cities.csv', (data) => {
  console.log(data)
  var EU = data.filter(d => d.eu === "true")
  console.log(EU)

  var eulist = d3.select('#main').append('div').attr('id', 'eu-list');
  eulist.append('h3').text(`${EU.length} European Union cities`);

  var svg3 = d3.select('#main').append('svg').attr('width', '700px').attr('height','500px');

  data.forEach(d => {d.x = Number(d.x); d.y = Number(d.y); d.population = Number(d.population); d.big = d.population > 1000000});

  svg3.selectAll('circle')
    .data(EU)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.big ? 8 : 4)
    .attr('fill', 'brown')
    .attr('stroke', 'black')
  svg3.selectAll('text')
    .data(EU)
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y - 20)
    .text((d) => d.big? `${d.city}` : "")
    // .text((d) => d.big? `${d.city}, ${d.country}` : "")



  // var euCountryList = eulist.append('ul').attr('class', 'list-group');
  // EU.forEach(city => {
  //   euCountryList.append('li').attr('class', 'list-group-item').text(`${city.city}, ${city.country}`);
  // });
})
