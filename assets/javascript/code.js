let date;
let vibe;
let loc;
// let completeResults = [];
let eventVenueResults = [];
let eventSearchResults = [];

const eventBriteSearchAPI = async (query, loc, date) => {
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

    try {
        const response = await $.ajax(eventSearchSettings)
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
    } catch (error) {
        console.log(error);
    }
    // TODO: Sort results data by the date
}

const eventBriteVenueAPI = async (venue_id) => {
    let eventVenueURL = "https://www.eventbriteapi.com/v3/venues/" + venue_id + "/";

    const eventVenueSettings = {
        url: eventVenueURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer IBJWZWCSCKANXCVUEZAY"
        }
    };

    try {
        const response = await $.ajax(eventVenueSettings)

        eventVenueResults.push({
            address: response.address.address_1,
            city: response.address.city,
            country: response.address.country,
            latitude: response.latitude,
            longitude: response.longitude
        });
    } catch (error) {
        console.log(error);
    }
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
    let cardTitle = $("<h5>").addClass("card-title").text(moment(event.startTime).format("lll") + " to " + moment(event.endTime).format("LT"));
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

    initMap("map-" + eventIndex, parseFloat(eventVenueResults[eventIndex].latitude), parseFloat(eventVenueResults[eventIndex].longitude));
};

$(".submit-btn").on("click", async function (event) {
    event.preventDefault();


    if ($("#location-input").val() === "" || $("#date-input").val() === "" || $("#vibe-input").val() === "") {
        alert("Please fill in all required fields")
    } else {
        date = moment($("#date-input").val().trim()).format("YYYY-MM-DDThh:mm:ss");
        vibe = $("#vibe-input").val().trim();
        loc = $("#location-input").val().trim();

        await eventBriteSearchAPI(vibe, loc, date);

        // await createGoogleMapsScript();
        for (let i = 0; i < eventSearchResults.length; i++) {
            const eventData = eventSearchResults[i];
            await eventBriteVenueAPI(eventData.venueId);
            createEventCard(eventData, i);
        };

        console.log(eventVenueResults);
        for (let i = 0; i < eventVenueResults.length; i++) {
            const eventVenue = eventVenueResults[i];
            initMap("map-" + i, parseFloat(eventVenue.latitude), parseFloat(eventVenue.longitude));
        }

        $("#date-input").val("");
        $("#vibe-input").val("");
        $("#location-input").val("");
        // $("#accordion-parent").empty();
        eventSearchResults = [];
        
    }
});



const createGoogleMapsScript = () => {
    let googleMapsScript = $("<script>").attr("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyAXYZDR89jXI_Ml7MCaV4TskRBqkkeZ7hk&callback=createMapMarker")
    $("body").append(googleMapsScript);
}
