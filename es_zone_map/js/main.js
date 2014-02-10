//given a school zone id, zoom and center map to that school zone polygon's bounding box

// init map with mapbox's tiles
var map = L.mapbox.map('map', 'chenrick.map-3gzk4pem', {
	maxBounds: new L.LatLngBounds([40.4378,-74.3342], [40.9635,-73.6008]),
	minZoom: 12,
	maxZoom: 16
})
  .setView([40.6949,-73.9558], 12); 

// load GeoJSON for elementary school zones
$.getJSON('./ES_Zones_2013-2014.geojson', function(data){
	console.log('geojson school zone data loaded: ', data);

	// styles for data:
	var zoneStyle = {
	    "color": "#ff7800",
	    "weight": 1,
	    "opacity": 0.65
	};

	// add geojson to map
	L.geoJson(data, { style: zoneStyle }).addTo(map);

	// function to zoom to the bounds of the selected feature
	var zoomToLayer = function(southWest, northEast){
		//console.log(southWest, northEast)
		map.fitBounds([southWest, northEast]);
	}

	// get lat lon bounding box of selected zone
	var features = data.features,
		len = features.length,
		i = 0;

	// loop through features
	for (i; i<len; i++){
		var labels = features[i].properties.Label
		var coordinates = features[i].geometry.coordinates

		//console.log('zone labels: ', labels);
		//console.log('coordinates: ', coordinates);

		// Query zone by id
		if (labels === "305") {
			console.log("PS3 coordinates: ", coordinates);

			console.log(coordinates[0]);

			var newCoordinates = coordinates[0]

			// grab bounding box coordinates
			var right = Math.max.apply(Math, newCoordinates.map(function(k) {
					    return k[0];
					})),

				left = Math.min.apply(Math, newCoordinates.map(function(k){
					return k[0];
				})),

				top = Math.max.apply(Math, newCoordinates.map(function(k){
					return k[1];
				})),

				bottom = Math.min.apply(Math, newCoordinates.map(function(k){
					return k[1];
				}));

			// set arrarys for lower left and upper right 
			var southWest = [bottom, left],
				northEast = [top, right];

			// debug
			console.log('left: ', left, ' top: ', top, ' right: ', right, ' bottom: ', bottom);
			console.log('southWest: ', southWest, ' northEast: ', northEast);

			// zoom to bounding box
			zoomToLayer(southWest, northEast);
		}

	}

});
