var app_id = "31029c4b";
var app_key = "498967012e2a5e3b0d4de92f26304949";
var source;
var destination;
var departureDate;

var flightURL = "http://developer.goibibo.com/api/search/?app_id=" + app_id + "&app_key=" + app_key +
    "&source=" + source + "&destination=" + destination + "&dateofdeparture=" + departureDate +
    "&seatingclass=E&adults=1&children=0&infants=0&counter=100"

$.ajax({
    url: flightURL,
    method: "GET"
}).then(function (response) {
    console.log(response)
});


function weather(){

var weatherURL = "api.openweathermap.org/data/2.5/weather?q=London"
//49a5dfb8d316b444e3e39062f4aa7fdf

$.ajax({
    url: weatherURL,
    method: "GET"
}).then(function (response) {
    console.log(response)
})

}
weather();
console.log("HEY");
