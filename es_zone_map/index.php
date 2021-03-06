<html>
<head>
	<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
	<link href='http://api.tiles.mapbox.com/mapbox.js/v1.4.2/mapbox.css' rel='stylesheet' />
	<script src='http://api.tiles.mapbox.com/mapbox.js/v1.4.2/mapbox.js'></script>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<style type="text/css"> 

		html, body {
			width: 100%;
			height: 100%;
			margin: 0px auto;
			padding: 0px;
		}

		#container {
			position: relative;
			width: 480px;
			height: 480px;
			padding: 0px;
			margin: 0px auto;
			top: 20%;
			background-color: hsla(0,0%,90%,0.8);			
			border: 1px solid black;
		}

		#map { 
			width:480px; 
			height:460px;
			margin: 0px auto;
		}
		
		#dis {
			position: absolute;
			display: block;
			margin: 0 auto;
			padding: 5px 5px 0px 5px;
			font: 12px sans-serif;
		}

		#dis span {
			text-transform: uppercase;
			font-weight: bold;
		}

		.leaflet-popup-content {
			text-align: center;
			/*line-height:;*/
		}

	</style>
</head>
<body>
	<div id="container">
	  	<div id='map'></div>
	  	<div id='dis'>
	  		<span>caution:</span> Zone lines subject to change. Call the school or 311 to confirm boundaries.
	  	</div>		
	</div>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script>window.jQuery || document.write('<script src="js/jquery-1.10.2.min.js"><\/script>')</script>
 	<script src="js/main.js"></script>
 	<script type="text/javascript">
 		window.onload = app.init("<?php echo $_GET['dbn'] ?>");
 	</script>
</body>
</html>