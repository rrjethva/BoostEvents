


$(".submit-btn").on("click", function (event){
    event.preventDefault();
   
    if ($("#locationInput").val() === "" || $("#date").val() === "" || $("#vibeInput").val() === ""){
        alert("Please fill in all required fields")
    }
    else {
        weatherAPI();
    }

    var date = moment($("#date").val().trim()).format("L");
    console.log("Date: " + date);

    var vibe = $("#vibeInput").val().trim();
    console.log("Vibe: " + vibe);
});


function weatherAPI() {
   

    var apiKey = "49a5dfb8d316b444e3e39062f4aa7fdf"
    var query = $("#locationInput").val().trim();
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey;
    
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log(query);
        
        var currentTemp = response.main.temp;
        console.log("Current temp: " + currentTemp +"°F");

    });

};

function eventbriteAPI() {
    var request = new XMLHttpRequest();

    request.open('GET', 'https://private-anon-b47911321b-eventbriteapiv3public.apiary-proxy.com/v3/events/search/');

    request.setRequestHeader('Authorization', 'Bearer HO5AZTOREHNL2RLDBLQ4  ');
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function (response) {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
            console.log(this.responseText.events);
            console.log(response.events);
            $('#body').text("<p>" + this.responseText + "</p>");
        }
    };

    request.send();
};

//weatherAPI();
//eventbriteAPI();