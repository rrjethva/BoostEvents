function weatherAPI(query) {

    const apiKey = "49a5dfb8d316b444e3e39062f4aa7fdf"
    let q = query
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&appid=" + apiKey;

    const settings = {
        url: weatherURL,
        method: "GET"
    }

    $.ajax(settings).then(function (response) {
        console.log(response)
    })
};

function eventBriteAPI(query, location) {
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
        success: function (response) {
            console.log(response);
            console.log(response.events);
        }
    };

    $.ajax(settings).then(function (response) {
        console.log(response)
    });
}
