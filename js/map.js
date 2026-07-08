const mapboxAccessToken =
    window.MAPBOX_ACCESS_TOKEN ||
    document.querySelector('meta[name="mapbox-token"]')?.content ||
    "";

if (!mapboxAccessToken) {
    console.warn("Mapbox access token is not configured.");
}

if (document.getElementById("map") && mapboxAccessToken) {
    mapboxgl.accessToken = mapboxAccessToken;
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v11",
        center: [100.5260242, 13.933704],
        zoom: 14,
        cooperativeGestures: true,
    });

    const geojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [100.5260242, 13.933704],
                },
            },
        ],
    };

    for (const feature of geojson.features) {
        const el = document.createElement("div");
        el.className = "marker";

        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
    }
    var markers = [
        { coordinates: [100.5260242, 13.933704] },
    ];
    markers.forEach(function (marker) { 
        var el = createMarkerElement();
        new mapboxgl.Marker({ element: el })
            .setLngLat(marker.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<div class="map-content"><h6>บริษัท ฟิวเจอร์ เน็กซ์ กรุ๊ป จำกัด</h6><p class="text caption-2">98/69 หมู่ที่ 5 ตำบลบ้านใหม่ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120</p><p class="text caption-2">โทร: 02-030-5225 / 083-908-5498</p></div>'))
            .addTo(map);
    });

    function createMarkerElement() {
        var el = document.createElement('div');
        el.className = 'marker';
        return el;
    }
}

if (document.getElementById("map1") && mapboxAccessToken) {
    mapboxgl.accessToken = mapboxAccessToken;
    const map1 = new mapboxgl.Map({
        container: "map1",
        style: "mapbox://styles/mapbox/light-v11",
        center: [-0.108968, 51.492933],
        zoom: 14,
        cooperativeGestures: true,
    });

    const geojson1 = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-0.108968, 51.492933],
                },
            },
        ],
    };

    for (const feature of geojson1.features) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "marker";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map1);
    }
}

if (document.getElementById("map2") && mapboxAccessToken) {
    mapboxgl.accessToken = mapboxAccessToken;
    const map2 = new mapboxgl.Map({
        container: "map2",
        style: "mapbox://styles/mapbox/light-v11",
        center: [-0.108968, 51.492933],
        zoom: 14,
        cooperativeGestures: true,
    });

    const geojson2 = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-0.108968, 51.492933],
                },
            },
        ],
    };

    for (const feature of geojson2.features) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "marker";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map2);
    }
}
