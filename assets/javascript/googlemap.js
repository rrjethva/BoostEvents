const initMap = (id, lat, lng) => {
    console.log(id, lat, lng);
    let loc = {
        lat: lat,
        lng: lng
    };
    let map = new google.maps.Map(document.getElementById(id), {
        zoom: 15,
        center: loc
    });
    let marker = new google.maps.Marker({
        position: loc,
        map: map
    });
};