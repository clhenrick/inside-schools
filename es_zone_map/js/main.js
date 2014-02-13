app = {
	map : null,
	renderMap : function(){

		var config = {
			mapBoxBaseLayer: 'chenrick.map-3gzk4pem',
			maxBounds: new L.LatLngBounds([40.4378,-74.3342], [40.9635,-73.6008]),
			minZoom: 12,
			maxZoom: 16,
			initZoom: 12,
			initLatLng: new L.LatLng(40.6949,-73.9558),
			zoomControl: true
		}
		// init map
		this.map = L.mapbox.map('map', config.mapBoxBaseLayer, config);
		// set init map center and zoom level
		this.map.setView(config.initLatLng, config.initZoom);		
		//disable drag and zoom handlers
		this.map.dragging.disable();
		this.map.touchZoom.disable();
		this.map.doubleClickZoom.disable();
		this.map.scrollWheelZoom.disable();
		// disable tap handler, if present.
		if (this.map.tap) this.map.tap.disable();		
	},

	fetchData: function(){
		var features,
			zoneStyle,
			esZones,
			features,
			len,
			i,
			labels,
			coordinates,
			target,
			hStyle,
			dStyle,
			styleData;


		$.getJSON('./ES_Zones_2013-2014.geojson', function(data){
			console.log('./ES_Zones_2013-2014.geojson: ', data);

			esZones = L.geoJson().addTo(app.map);
			//esZones = L.geoJson(data, { style: app.dStyle }).addTo(app.map);

			features = data.features;
			len = features.length;
			i=0;

			// loop through school zone geojson features
			for (i; i<len; i++){
				labels = features[i].properties.Label;
				coordinates = features[i].geometry.coordinates[0];
				// variable for db query
				target = "305";

				// query features by zone id
				if (labels === target) {
					// console.log("i: ", i);
					// console.log("PS305 coordinates[0]: ", coordinates);

					styleData = function(feature){
						switch(labels) {
							case target: return app.hStyle;
							case !target: return app.dStyle;
							default: return app.dStyle;
						}
					},

					esZones.addData(data);
					esZones.setStyle(styleData());

					// grab bounding box coordinates
					var right = Math.max.apply(Math, coordinates.map(function(k) {
							return k[0];
						})),

						left = Math.min.apply(Math, coordinates.map(function(k){
							return k[0];
						})),

						top = Math.max.apply(Math, coordinates.map(function(k){
							return k[1];
						})),

						bottom = Math.min.apply(Math, coordinates.map(function(k){
							return k[1];
						}));

					// set arrarys for lower left and upper right 
					var southWest = [bottom, left],
						northEast = [top, right];

					// debug
					console.log('left: ', left, ' top: ', top, ' right: ', right, ' bottom: ', bottom);
					console.log('southWest: ', southWest, ' northEast: ', northEast);

					// zoom to bounding box
					app.zoomToLayer(southWest, northEast);
				}
			}
		});
	},

	zoomToLayer : function(sw, ne) {
		app.map.fitBounds([sw, ne], { padding: [10,10] });
	},

	hStyle : {
	    "color": "#0000ff",
	    "weight": 1,
	    "opacity": 0.65
	},

	dStyle: {
	    "color": "#ff0000",
	    "weight": 1,
	    "opacity": 0.65
	},

	// styleData : function(feature){
	// 	switch(labels) {
	// 		case target: return app.hStyle;
	// 		default: app.dStyle;
	// 	}
	// },

	init : function(){
		app.renderMap();
		app.fetchData();
	}

} // end app

window.onload = app.init;