app = {
	map : null,
	esZones : null,
	schools : null,
	marker : null,
	data : null,
	target: null,
	group : null,

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

		this.group = new L.featureGroup().addTo(this.map);
		//console.log('this group: ', this.group);
	},

	fetchData: function(){
		$.getJSON('./data/ES_Zones_2013-2014.geojson', function(data){
			console.log('./ES_Zones_2013-2014.geojson loaded: ', data);
			// app.data = data;
			// app.parseData(data);
			app.esZones = L.geoJson(data, {
				style: app.style,
				onEachFeature: app.onEachFeature
			} ).addTo(app.map);
		})
		.done(function(){
			// when data is finished loading
			// fit lat lon bounds of layerGroup to map
			app.map.fitBounds(app.group.getBounds());
		});

		$.getJSON('./data/public_school_points.geojson', function(data){
			console.log('schools loaded: ', data);
			app.parseData(data);
		});
	},

	onEachFeature : function(feature, layer){
		// loop over geoJson features
		// append features to layerGroup that match dbn
		var dbn = feature.properties.DBN,
			zone;
		if (dbn !== null) {
			if (dbn.indexOf(app.target) !== -1) {
				//app.group.addLayer(feature);
				//console.log("featue(s): ", feature);
				zone = new L.polygon(feature).toGeoJSON();
				app.group.addLayer(layer);

				console.log('zone: ', zone, ' layer: ', layer);
			}
		}
	},

	parseData : function(data){
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
				app.schools = L.marker([lat, lon]);
				app.group.addLayer(app.schools);
				app.schools.bindPopup("<b>" + name + "</b>", popUp).openPopup();
			}
		}
	},

	style : function(feature){
		if (feature.properties.DBN !== null){
			switch(feature.properties.DBN.indexOf(app.target)) {
			case -1 : return app.dStyle;
				break;
			default : return app.hStyle;								
			}
		} else if (feature.properties.DBN === null){
			return app.dStyle;
			}
	},

	hStyle : {
	    color: "#0066cc",
	    weight: 1.5,
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

} 

window.onload = app.init("30Q127");