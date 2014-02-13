app = {
	map : null,
	esZones : null,
	data : null,
	target: null,

	renderMap : function(){

		var config = {
			mapBoxBaseLayer: 'chenrick.map-3gzk4pem',
			maxBounds: new L.LatLngBounds([40.4378,-74.3342], [40.9635,-73.6008]),
			minZoom: 12,
			maxZoom: 16,
			initZoom: 12,
			initLatLng: new L.LatLng(40.6949,-73.9558),
			zoomControl: false
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
		$.getJSON('./ES_Zones_2013-2014.geojson', function(data){
			//console.log('./ES_Zones_2013-2014.geojson: ', data);
			app.data = data;
			//console.log('app.data: ', data);
			app.parseData(data);
		});
	},

	parseData: function(data){
		var geojson = data;
		console.log('parseData data: ', data);
		var features = geojson.features;
		var len = features.length;
		var i=0;
		var labels, coordinates;

		// loop through school zone geojson features
		for (i; i<len; i++){
			labels = features[i].properties.Label;
			coordinates = features[i].geometry.coordinates[0];
			// variable for db query
			app.target = "321";

			// query features by zone id
			if (labels === app.target) {
				console.log("i: ", i);
				// console.log("PS305 coordinates[0]: ", coordinates);

				// add and style esZones
				app.esZones = L.geoJson(app.data, {style: app.dStyle}).addTo(app.map);
				app.initGeoJson(app.target);
				//app.fitBounds();

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
	},

	initGeoJson : function(n) {
        console.log(app.esZones.options);
        app.map.removeLayer(app.esZones);
        if (n != "") {
            sn = n;
            console.log(sn);
            geojson = L.geoJson(app.data, {
                style: app.style
            }).addTo(app.map);
        }
    },

    style : function(feature) {
        if (app.target === feature.properties.Label) {
            return app.hStyle;
            
        } else {
            return app.dStyle;
        }
    },

	zoomToLayer : function(sw, ne) {
		app.map.fitBounds([sw, ne], { padding: [10,10] });
	},

	fitBounds: function(geojson){
		var bounds = geojson.getBounds();
		console.log('bounds: ', bounds);
		app.map.fitBounds(bounds, { padding: [10,10] });
	},

	hStyle : {
	    color: "#666666",
	    weight: 1,
	    opacity: 1,
	    dashArray: "3, 7",
	    fillOpacity: 0.3,
	    fillColor: "#fce305"
	},

	dStyle: {
		weight: 1,
	    color: "#666666",
	    opacity: 1,
	    dashArray: "3 ,7",
	    fillOpacity: 0.1,
	    fillColor: '#0000ff'
	},

	init : function(){
		app.renderMap();
		app.fetchData();
	}

} // end app!

window.onload = app.init;