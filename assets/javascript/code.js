let date;
let vibe;
let loc;
let results = [];

$(".submit-btn").on("click", function (event) {
    event.preventDefault();

    if ($("#location-input").val() === "" || $("#date-input").val() === "" || $("#vibe-input").val() === "") {
        alert("Please fill in all required fields")
    } else {
        date = moment($("#date-input").val().trim()).format("L");
        vibe = $("#vibe-input").val().trim();
        loc = $("#location-input").val().trim();

        weatherAPI(loc);
        eventBriteAPI(vibe, loc);

        setTimeout(function () {
            for (let i = 0; i < results.length; i++) {
                createEventCard(results[i], i);
            }
        }, 100);

        $("#date-input").val("");
        $("#vibe-input").val("");
        $("#location-input").val("");
        $("#accordion-parent").empty();
        results = [];
    }
});

const weatherAPI = (loc) => {
    const apiKey = "49a5dfb8d316b444e3e39062f4aa7fdf"
    let q = loc
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log(q);

        var currentTemp = response.main.temp;
        console.log("Current temp: " + currentTemp + "°F");
    });
};

const eventBriteAPI = (query, loc) => {
    let q = query
    let locationAddress = loc;

    let eventURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + q + "&location.address=" + locationAddress + "&location.within=10km";

    const settings = {
        async: false,
        sort_by: "best",
        url: eventURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer HO5AZTOREHNL2RLDBLQ4",
        },
    };

    $.ajax(settings).then(function (response) {
        console.log(response)
        for (let i = 0; i < 10; i++) {
            event = response.events[i];
            let eventObj = {};

            if (event.logo !== null) {
                eventObj = {
                    name: event.name.text,
                    description: event.description.text,
                    startTime: event.start.local,
                    endTime: event.end.local,
                    url: event.url,
                    logoURL: event.logo.url
                }
            } else {
                eventObj = {
                    name: event.name.text,
                    description: event.description.text,
                    startTime: event.start.local,
                    endTime: event.end.local,
                    url: event.url
                }
            };
            results.push(eventObj);
        }
        console.log(results);
    });
}

const createEventCard = (event, index) => {
    let card = $("<div>").addClass("card");

    let cardHead = $("<div>").addClass("card-header").text(event.name)
    cardHead.attr("id", "header-" + index);

    let cardHeadButton = $("<i>").addClass("material-icons drop-down").text("expand_more")
    cardHeadButton.attr("type", "button");
    cardHeadButton.attr("data-toggle", "collapse");
    cardHeadButton.attr("data-target", "#event-" + index);
    cardHeadButton.attr("aria-expanded", "true");
    cardHeadButton.attr("aria-controls", "event-" + index);
    cardHead.append(cardHeadButton);

    let cardBodyWrapper = $("<div>").addClass("collapse hide");
    cardBodyWrapper.attr("id", "event-" + index);
    cardBodyWrapper.attr("aria-labelledby", "header-" + index);
    cardBodyWrapper.attr("data-parent", "#accordion-parent");

    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h5>").addClass("card-title").text(moment(event.startTime).format("lll") + " to " + moment(event.endTime).format("lll"));
    let cardText = $("<p>").addClass("card-text").text(event.description);
    
    if (event.logoURL) {
        let cardImg = $("<img>").attr("src", event.logoURL);
        cardBody.append(cardImg);
    }
        
    let link = $("<a>").addClass("btn btn-primary").text("Go ->");
    link.attr("href", event.url);
    link.attr("target", "_blank");

    cardBody.append(cardTitle, cardText, link);
    cardBodyWrapper.append(cardBody);
    card.append(cardHead, cardBodyWrapper);
    $("#accordion-parent").append(card);
}