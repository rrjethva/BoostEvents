$(".submit-btn").on("click", function (event) {
    event.preventDefault();

    if ($("#locationInput").val() === "" || $("#date").val() === "" || $("#").val() === "") {
        alert("Please fill in all required fields")
    } else {
        let date = moment($("#date").val().trim()).format("L");
        console.log("Date: " + date);
        
        let vibe = $("#vibeInput").val().trim();
        console.log("Vibe: " + vibe);
        weatherAPI(location);
    }
});

const weatherAPI = (location) => {
    const apiKey = "49a5dfb8d316b444e3e39062f4aa7fdf"
    let q = location
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&appid=" + apiKey;

    const settings = {
        url: weatherURL,
        method: "GET"
    }

    $.ajax(settings).then(function (response) {
        console.log(response)
    })
};

const eventBriteAPI = (query, location) => {
    
    let event = [];
    let name;
    let description;
    let startTime;
    let endTime;
    let url;
    let logoURL;

    let q = query
    let locationAddress = location;

    let eventURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + q + "&location.address=" + locationAddress + "&location.within=10km";

    const settings = {
        async: true,
        sort_by: "best",
        url: eventURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer HO5AZTOREHNL2RLDBLQ4",
        },
    };

    $.ajax(settings).then(function (response) {
        console.log(response)
        // for (let i = 0; i < response.events.length; i++) {
            // event = response.events[i];
        event = response.events[0];
        name = event.name.text;
        description = event.description.text;
        startTime = event.start.local;
        endTime = event.end.local;
        url = event.url;
        logoURL = event.logo.url;
        console.log(name);
        }
    );
}

// weatherAPI("philadelphia")
eventBriteAPI("beer", "philadelphia")