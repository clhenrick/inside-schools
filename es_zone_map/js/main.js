app = {
	map : null,
	esZones : null,
	schools : null,
	marker : null,
	data : null,
	target: null,

	renderMap : function(){

		var config = {
			mapBoxBaseLayer: 'inside-schools.heafm0kb',
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
		$.getJSON('./data/ES_Zones_2013-2014.geojson', function(data){
			console.log('./ES_Zones_2013-2014.geojson loaded: ', data);
			app.data = data;
			app.parseData(data);
		});

		$.getJSON('./data/public_school_points.geojson', function(data){
			console.log('schools loaded: ', data);
			app.parseDataToo(data);
		})
	},

	parseData: function(data){
		app.esZones = L.geoJson(data, {style: app.style}).addTo(app.map);
		//console.log('parseData data: ', data);
		//console.log('esZones: ', app.esZones);
		var features = data.features;
		var len = features.length;
		var i=0;
		var dbn, coordinates;

		// loop through school zone geojson features
		for (i; i<len; i++){
			dbn = features[i].properties.DBN;
			coordinates = features[i].geometry.coordinates[0];
			// *** variable for db query, this will be dynamic later ***

			// query features by zone id
			if (dbn === app.target) {
				//console.log('sel feature: ', features);

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

	parseDataToo : function(data){
		var i = 0,
			features = data.features,
			len = data.features.length,
			num, ats, lat, lon,
			popUp = {
				closeButton : false,
				closeOnClick: false,
				// maxHeight : 50,
				// maxWidth: 45
			};

		for (i; i<len; i++){
			ats = features[i].properties.ATS_CODE;
			name = features[i].properties.SCHOOLNAME;
			lat = features[i].properties.YCOORD;
			lon = features[i].properties.XCOORD;

			//console.log('ats: ', ats, ' name: ', name, ' lat: ', lat, 'lon: ', lon);

			if (ats == app.target) {
				app.schools = L.marker([lat, lon]).addTo(app.map);
				app.schools.bindPopup("<b>" + name + "</b>", popUp).openPopup();
			}
		}
		
		//app.schools = L.geoJson(data).addTo(app.map);
	},

	style : function(feature){
		switch(feature.properties.DBN) {
			case app.target : return app.hStyle;
				break;
			default : return app.dStyle;								
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
	    color: "#0066cc",
	    weight: 3,
	    opacity: .7,
	    // dashArray: "",
	    fillOpacity: 0.2,
	    fillColor: "#0066cc"
	},

	dStyle: {
		weight: 0,
	    color: "#666666",
	    opacity: 0,
	    dashArray: "3 ,7",
	    fillOpacity: 0,
	    fillColor: '#0066cc'
	},

	init : function(dbn){
		app.target = dbn;		
		app.renderMap();
		app.fetchData();
	}

} // end app!

window.onload = app.init("15K131");