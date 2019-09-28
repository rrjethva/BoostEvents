let date;
let vibe;
let loc;
let weather;

$(".submit-btn").on("click", function (event) {
    event.preventDefault();

    if ($("#location-input").val() === "" || $("#date-input").val() === "" || $("#vibe-input").val() === "") {
        alert("Please fill in all required fields")
    } else {
        date = moment($("#date-input").val().trim()).format("L");
        vibe = $("#vibe-input").val().trim();
        loc = $("#location-input").val().trim();

        weather = weatherAPI(loc);
        eventBriteAPI(vibe, loc);

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
    let results = [];
    let eventURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + query + "&location.address=" + loc + "&location.within=10km";

    const settings = {
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
            let eventObj = {};
            event = response.events[i];

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
        };

        for (let i = 0; i < results.length; i++) {
            createEventCard(results[i], i);
        };
    });
}

const createEventCard = (event, eventIndex) => {
    let card = $("<div>").addClass("card");
    console.log("Test");

    let cardHead = $("<div>").text(event.name)
    cardHead.attr({
        "class": "card-header",
        "id": "header-" + eventIndex
    });

    let cardHeadButton = $("<i>").text("expand_more")
    cardHeadButton.attr({
        "class": "material-icons drop-down",
        "type": "button",
        "data-toggle": "collapse",
        "data-target": "#event-" + eventIndex,
        "aria-expanded": "true",
        "aria-controls": "event-" + eventIndex
    });
    cardHead.append(cardHeadButton);

    let cardBodyWrapper = $("<div>").attr({
        "class": "collapse hide",
        "id": "event-" + eventIndex,
        "aria-labelledby": "header-" + eventIndex,
        "data-parent": "#accordion-parent"
    });

    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h5>").addClass("card-title").text(moment(event.startTime).format("lll") + " to " + moment(event.endTime).format("lll"));
    let cardText = $("<p>").addClass("card-text").text(event.description);
    
    if (event.logoURL) {
        let cardImg = $("<img>").attr("src", event.logoURL);
        cardBody.append(cardImg);
    }
        
    let link = $("<a>").text("Go to Page");
    link.attr({
        "class": "btn btn-primary",
        "href": event.url,
        "target": "_blank"
    });

    cardBody.append(cardTitle, cardText, link);
    cardBodyWrapper.append(cardBody);
    card.append(cardHead, cardBodyWrapper);
    $("#accordion-parent").append(card);
}