let map;
let placeMarker;
let poiMarkers = [];

function initMap() {
  const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 2,
  });

  const input = document.getElementById("searchInput");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  autocomplete.setFields(["geometry", "name"]);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(15);

    if (placeMarker) placeMarker.setMap(null);
    placeMarker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name
    });

    clearPOIMarkers();
    findNearbyPOIs(place.geometry.location);
  });
}

function findNearbyPOIs(location) {
  const service = new google.maps.places.PlacesService(map);
  const request = {
    location: location,
    radius: 1000, // 1km
    type: ["point_of_interest"] // POI search
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name,
          icon: {
            url: place.icon,
            scaledSize: new google.maps.Size(20, 20)
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<strong>${place.name}</strong><br>${place.vicinity}`
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        poiMarkers.push(marker);
      });
    }
  });
}

function clearPOIMarkers() {
  poiMarkers.forEach(marker => marker.setMap(null));
  poiMarkers = [];
}
