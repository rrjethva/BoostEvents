let date;
let vibe;
let loc;
let results = [];

$(".submit-btn").on("click", function (event) {
    event.preventDefault();

    if ($("#location-input").val() === "" || $("#date-input").val() === "" || $("#vibe-input").val() === "") {
        alert("Please fill in all required fields")
    } else {
        date = moment($("#date-input").val().trim()).format("YYYY-MM-DDThh:mm:ss");
        vibe = $("#vibe-input").val().trim();
        loc = $("#location-input").val().trim();

        eventBriteSearchAPI(vibe, loc, date);

        $("#date-input").val("");
        $("#vibe-input").val("");
        $("#location-input").val("");
        $("#accordion-parent").empty();
        results = [];
    }
});

const eventBriteSearchAPI = (query, loc, date) => {
    let eventSearchURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + query +
        "&location.address=" + loc +
        "&location.within=10km" +
        "&start_date.range_start=" + date +
        "&sort_by=best";

    const eventSearchSettings = {
        url: eventSearchURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer HO5AZTOREHNL2RLDBLQ4",
        },
    };

    $.ajax(eventSearchSettings).then(function (response) {
        console.log(response)

        for (let i = 0; i < 10; i++) {
            let eventSearchObj = {};
            const event = response.events[i];

            if (event.logo !== null) {
                eventSearchObj = {
                    name: event.name.text,
                    description: event.description.text,
                    startTime: event.start.local,
                    endTime: event.end.local,
                    url: event.url,
                    logoURL: event.logo.url,
                    venueId: event.venue_id,
                }
            } else {
                eventSearchObj = {
                    name: event.name.text,
                    description: event.description.text,
                    startTime: event.start.local,
                    endTime: event.end.local,
                    url: event.url,
                    venueId: event.venue_id,
                }
            };
            results.push(eventSearchObj);
        };

        for (let j = 0; j < results.length; j++) {
            const venue_id = results[j].venueId;
            eventBriteVenueAPI(venue_id);
        }
        
        console.log(results);
        // TODO: Sort results data by the date
        for (let i = 0; i < results.length; i++) {
            createEventCard(results[i], i);
        };
    });
}

const eventBriteVenueAPI = (venue_id) => {
    let eventVenueURL = "https://www.eventbriteapi.com/v3/venues/" + venue_id + "/";

    const eventVenueSettings = {
        url: eventVenueURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer IBJWZWCSCKANXCVUEZAY"
        }
    };

    $.ajax(eventVenueSettings).then(function (response) {
        for (let i = 0; i < results.length; i++) {
            const eventData = results[i]
            eventData.address = response.address.address_1;
            eventData.city = response.address.city;
            eventData.country = response.address.country;
            eventData.latitude = response.latitude;
            eventData.longitude = response.longitude;
        };
    });
}

const createEventCard = (event, eventIndex) => {
    let card = $("<div>").addClass("card");

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