let map;
let departureMarker;
let arrivalMarker;
let directionsService;
let directionsRenderer;
const costPerKm = 5; // Km başına ücret, burayı ihtiyacınıza göre değiştirebilirsiniz

function initMap() {
    const defaultLocation = { lat: 41.0082, lng: 28.9784 }; // İstanbul
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const departureInput = document.getElementById("departure");
    const arrivalInput = document.getElementById("arrival");

    const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
    const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);

    // Kalkış noktasını işaretleme
    departureAutocomplete.addListener("place_changed", () => {
        const place = departureAutocomplete.getPlace();
        if (place.geometry) {
            if (departureMarker) {
                departureMarker.setMap(null);
            }
            departureMarker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: "Kalkış Noktası (A)",
                label: "A"
            });
            map.setCenter(place.geometry.location);
            calculateRoute(); // Rota hesapla
        }
    });

    // Varış noktasını işaretleme
    arrivalAutocomplete.addListener("place_changed", () => {
        const place = arrivalAutocomplete.getPlace();
        if (place.geometry) {
            if (arrivalMarker) {
                arrivalMarker.setMap(null);
            }
            arrivalMarker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: "Varış Noktası (B)",
                label: "B"
            });
            map.setCenter(place.geometry.location);
            calculateRoute(); // Rota hesapla
        }
    });
}

// Rota hesaplama fonksiyonu
function calculateRoute() {
    const origin = document.getElementById('departure').value; // Kalkış noktası
    const destination = document.getElementById('arrival').value; // Varış noktası

    if (!origin || !destination) {
        alert('Lütfen kalkış ve varış noktalarını girin.');
        return;
    }

    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING // Sürüş modunu belirtiyoruz
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const distance = result.routes[0].legs[0].distance.value / 1000; // KM cinsine çevir
            const estimatedCost = distance * costPerKm; // Km başına belirlenen ücreti hesapla
            document.getElementById('estimated-cost').innerText = `Tahmini Ücret: ${estimatedCost.toFixed(2)} TL`;
        } else {
            alert('Rota Bulunamadı: ' + status);
        }
    });
}

// Harita yüklendiğinde initMap fonksiyonunu çağır
window.onload = initMap;
