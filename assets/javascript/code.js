let date;
let vibe;
let loc;
let eventSearchResults = [];
let eventVenueResults = [];
let completeResults = [];

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
        eventSearchResults = [];
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
            eventSearchResults.push(eventSearchObj);
        };

        for (let i = 0; i < eventSearchResults.length; i++) {
            const eventData = eventSearchResults[i];
            eventBriteVenueAPI(eventData.venueId);
            createEventCard(eventData, i);
        };

        for (let i = 0; i < completeResults.length; i++) {
            const _eventData = completeResults[i];
            createMapMarker(parseInt(_eventData.latitude), parseInt(_eventData.longitude));
        }

        // TODO: Sort results data by the date
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
        eventVenueResults.push({
            address: response.address.address_1,
            city: response.address.city,
            country: response.address.country,
            latitude: response.latitude,
            longitude: response.longitude
        });

        completeResults = eventSearchResults.map(function (eventData, i) {
            return {
                "event": eventData,
                "venue": eventVenueResults[i]
            };
        });
    });
};

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

    let cardMap = $("<div>").attr({
        "class": "map",
        "id": "map-" + eventIndex
    });

    let link = $("<a>").text("Go to Page");
    link.attr({
        "class": "btn btn-primary",
        "href": event.url,
        "target": "_blank"
    });


    cardBody.append(cardTitle, cardText, cardMap, link);
    cardBodyWrapper.append(cardBody);
    card.append(cardHead, cardBodyWrapper);
    $("#accordion-parent").append(card);
};

const initMap = (lat, lng) => {
    console.log(lat, lng)
    var loc = { lat: lat, lng: lng };
    var map = new google.maps.Map($("#map-1"), { zoom: 4, center: loc });
    var marker = new google.maps.Marker({
        position: loc,
        map: map
    });
};

google.maps.event.addDomListener(window, "load", initMap);
