
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);
dataFiltering();
function dataFiltering(type) {
	var attractions = attractionData;

  if(type != "All Attractions" && typeof type != "undefined") {
    attractions = attractions.filter((attraction) => {
      return attraction.Category === type;
    })
  }

  var topFiveVisitors = (data) => data.sort((a, b) => {
    return b.Visitors - a.Visitors;
  }).slice(0,5);

  renderBarChart(topFiveVisitors(attractions).slice(0,5))

	/* **************************************************
	 *
	 * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
	 *
	 * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
	 *
	 * renderBarChart(data)
	 *
	 * - 'data' must be an array of JSON objects
	 * - the max. length of 'data' is 5
	 *
	 * **************************************************/

}



document.getElementById("attraction-category").addEventListener("change", (e) => {
  var type = e.target.value;
  dataFiltering(type)
})
