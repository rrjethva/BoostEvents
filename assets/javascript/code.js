
function weather() {

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


var request = new XMLHttpRequest();
var location = $(this).attr("locationInput");

request.open('GET', 'https://www.eventbriteapi.com/v3/events/search?location.address=' + location + '&expand=venue');

request.setRequestHeader('Authorization', 'Bearer HO5AZTOREHNL2RLDBLQ4  ');
request.setRequestHeader('Content-Type', 'application/json');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log(this.location);
    console.log('location.address');
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);

    $('#body').text("<p>" + this.responseText + "</p>");
  }
};

request.send();
