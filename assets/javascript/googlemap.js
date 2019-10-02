function initMap (id, lat, lng) {
    console.log(id, lat, lng);
    var loc = {
        lat: lat,
        lng: lng
    };
    var map = new google.maps.Map(document.getElementById(id), {
        zoom: 15,
        center: loc
    });
    var marker = new google.maps.Marker({
        position: loc,
        map: map
    });
};