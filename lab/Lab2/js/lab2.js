
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);
dataFiltering();
function dataFiltering(type) {
	var attractions = attractionData;

  if(type != "all" && typeof type != "undefined") {
    attractions = attractions.filter((attraction) => {
      return attraction.Category === type;
    })
  }

  var topFiveVisitors = (data) => data.sort((a, b) => {
    return b.Visitors - a.Visitors;
  }).slice(0,5);

  renderBarChart(topFiveVisitors(attractions).slice(0,5))
}

document.getElementById("attraction-category").addEventListener("change", (e) => {
  dataFiltering(e.target.value);
})
