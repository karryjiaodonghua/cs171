// Activity I

var rollerCoaster = {
  id: 1,
  name: "Roller Coaster",
  price: 5,
  open: [0, 1, 3, 4, 5],
  noChildren: true
}

var itsASmallWorld = {
  id: 2,
  name: "It's a Small World, After All",
  price: 3,
  open: [0, 1, 2, 3, 4, 5, 6],
  noChildren: false
}

var miniGolf = {
  id: 3,
  name: "Mini-Golf",
  price: 4,
  open: [0, 1, 2, 3],
  noChildren: false
}

var attractions = [rollerCoaster, itsASmallWorld, miniGolf]

attractions.forEach((ride, i) => {
  console.log(ride.name + " costs $" + (i == 2 ? 0.5 : 1) * ride.price)
})

// Activity II

var doublePrices = (rides) => {
  return rides.map((ride, i) => {
    ride.price = (i == 1 ? ride.price : ride.price * 2);
    return ride;
  })
}

var debugAmusementRides = (rides) => {
  rides.forEach((ride) => {
    console.log("\"" + ride.name + "\" costs $" + ride.price);
  })
}

debugAmusementRides(doublePrices(attractions))

var newRowHtmlString = (ride) => "<tr><td>" + ride.name + "</td><td>$" + ride.price + "</td></tr>";

document.getElementById("attractions").innerHTML += (doublePrices(attractions).map(newRowHtmlString).join(""));
