let date;
let vibe;
let results = [];
let city;

$(".submit-btn").on("click", function (event) {
    event.preventDefault();

    if ($("#locationInput").val() === "" || $("#date").val() === "" || $("#vibeInput").val() === "") {
        alert("Please fill in all required fields")
    } else {
        date = moment($("#date").val().trim()).format("L");
        vibe = $("#vibeInput").val().trim();
        city = $("#locationInput").val().trim();

        // weatherAPI(city);
        eventBriteAPI(vibe, city);

        setTimeout(function () {
            for (let i = 0; i < results.length; i++) {
                createEventCard(results[i], i);
            }
        }, 100);


        $("#date").val("");
        $("#vibeInput").val("");
        $("#locationInput").val("");
        $(".results").empty();
        results = [];
    }
});

// $(".btn-link").on("click", function () {
//     targetID = $(this).attr("data-toggle");
//     $(targetID).attr("class", "collapse hide");
// });

const weatherAPI = (city) => {
    const apiKey = "49a5dfb8d316b444e3e39062f4aa7fdf"
    let q = city
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log(q);
        
        var currentTemp = response.main.temp;
        console.log("Current temp: " + currentTemp +"°F");
    });
};

const eventBriteAPI = (query, city) => {
    let q = query
    let locationAddress = city;

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

            let eventObj = {
                name: event.name.text,
                description: event.description.text,
                startTime: event.start.local,
                endTime: event.end.local,
                url: event.url,
                // TODO: Check if logo is null
                // logoURL: event.logo.url
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

    let cardBodyWrapper = $("<div>").addClass("collapse show");
    cardBodyWrapper.attr("id", "event-" + index);
    cardBodyWrapper.attr("aria-labelledby", "header-" + index);
    cardBodyWrapper.attr("data-parent", "#accordion-parent");

    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h5>").addClass("card-title").text(moment(event.startTime).format("lll") + " to " + moment(event.endTime).format("lll"));
    let cardText = $("<p>").addClass("card-text").text(event.description);
    let link = $("<a>").addClass("btn btn-primary").text("Go ->");
    link.attr("href", event.url);
    link.attr("target", "_blank");

    cardBody.append(cardTitle, cardText, link);
    cardBodyWrapper.append(cardBody);

    card.append(cardHead, cardBodyWrapper);
    $("#accordion-parent").append(card);
}