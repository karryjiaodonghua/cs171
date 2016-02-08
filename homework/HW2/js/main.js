// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function addStat (name, value) {
  $("#stats").append(
    "<tr>" +
      "<td>" + name + "</td>" +
      "<td>" + value + "</td>" +
    "</tr>"
  );
}

function createVisualization() {




  /* ************************************************************
   *
   * ADD YOUR CODE HERE
   * (accordingly to the instructions in the HW2 assignment)
   *
   * 1) Filter data
   * 2) Display key figures
   * 3) Display bar chart
   * 4) React to user input and start with (1)
   *
   * ************************************************************/


  var numDeliveries = deliveryData.length;
  var totalDelivered = deliveryData.reduce((total, next) => {
    return {
      count: total.count + next.count
    }
  }).count;
  var avgTime = deliveryData.reduce((total, next) => {
    return {
      delivery_time: total.delivery_time + next.delivery_time
    }
  }).delivery_time / numDeliveries;
  var totalSales = deliveryData.reduce((total, next) => {
    return {
      price: total.price + next.price
    }
  }).price;
  var numFeedback = feedbackData.length;
  var feedbackByType = {
    high: feedbackData.filter((f) => f.quality === "high").length,
    medium: feedbackData.filter((f) => f.quality === "medium").length,
    low: feedbackData.filter((f) => f.quality === "low").length
  }

  addStat("Number of deliveries: ", numDeliveries);
  addStat("Number of pizzas delivered: ", totalDelivered);
  addStat("Average delivery time: ", "$" + avgTime.toFixed(2));
  addStat("Total Sales: ", totalSales);
  addStat("Number of feedback: ", numFeedback);
  addStat("High rating", feedbackByType.high);
  addStat("Medium rating", feedbackByType.medium);
  addStat("Low rating", feedbackByType.low);

  renderBarChart(deliveryData)
}
