let date;
let vibe;
let loc;
<<<<<<< HEAD

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
    let results = [];
=======
// let completeResults = [];
let eventVenueResults = [];
let eventSearchResults = [];

const eventBriteSearchAPI = async (query, loc, date) => {
>>>>>>> 75a87829563aefe74333121e36d587c2505b084f
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
            let eventObj = {};
            event = response.events[i];

            if (event.logo !== null) {
                eventObj = {
                    name: event.name.text,
                    description: event.description.text,
                    startTime: event.start.local,
                    endTime: event.end.local,
                    url: event.url,
                    logoURL: event.logo.url,
                    venueID: event.venue_id
                }
            } else {
                eventObj = {
                    name: event.name.text,
                    description: event.description.text,
                    startTime: event.start.local,
                    endTime: event.end.local,
                    url: event.url,
                    venueID: event.venue_id
                }
<<<<<<< HEAD
            }

            eventBriteVenueAPI(event.venue_id);

            results.push(eventObj);
        };
        // TODO: Sort results data by the date

        for (let i = 0; i < results.length; i++) {
            createEventCard(results[i], i);
        };
    });
}

const eventBriteVenueAPI = (venue_id) => {

=======
            };
            eventSearchResults.push(eventSearchObj);
        };
    } catch (error) {
        console.log(error);
    }
    // TODO: Sort results data by the date
}

const eventBriteVenueAPI = async (venue_id) => {
>>>>>>> 75a87829563aefe74333121e36d587c2505b084f
    let eventVenueURL = "https://www.eventbriteapi.com/v3/venues/" + venue_id + "/";

    const eventVenueSettings = {
        url: eventVenueURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer IBJWZWCSCKANXCVUEZAY",
        },
    };

<<<<<<< HEAD
    $.ajax(eventVenueSettings).then(function (response) {
        console.log(response);
    })
}
=======
    try {
        const response = await $.ajax(eventVenueSettings)

        eventVenueResults.push({
            address: response.address.address_1,
            city: response.address.city,
            country: response.address.country,
            latitude: response.latitude,
            longitude: response.longitude
        });

        // completeResults = eventSearchResults.map(function (eventData, i) {
        //     return {
        //         "event": eventData,
        //         "venue": eventVenueResults[i]
        //     };
        // });
    } catch (error) {
        console.log(error);
    }
};
>>>>>>> 75a87829563aefe74333121e36d587c2505b084f



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

    let link = $("<a>").text("Go to Page");
    link.attr({
        "class": "btn btn-primary",
        "href": event.url,
        "target": "_blank"
    });

<<<<<<< HEAD
    cardBody.append(cardTitle, cardText, link);
    cardBodyWrapper.append(cardBody);
    card.append(cardHead, cardBodyWrapper);
    $("#accordion-parent").append(card);
}
=======
    cardBody.append(cardTitle, cardText, cardMap, link);
    cardBodyWrapper.append(cardBody);
    card.append(cardHead, cardBodyWrapper);
    $("#accordion-parent").append(card);

    // initMap("map-" + eventIndex, parseInt(eventVenueResults[eventIndex].latitude), parseInt(eventVenueResults[eventIndex].longitude));
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
>>>>>>> 75a87829563aefe74333121e36d587c2505b084f
