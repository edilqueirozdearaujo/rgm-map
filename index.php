<?
// Projeto RGM
// 
//
//
//

//======= Includes
include_once "include/lang.php"; 	
include_once "include/config.php"; 	
include_once "include/funcoes.php"; 	
//include_once "include/db.php"; 	
include_once "include/proc.php"; 	 	


//======= Only for this page
	$MinhaURL 	   = $_SERVER['PHP_SELF'];
	$MinhaURL = NoIndexPHP($MinhaURL);	
	$SessionName = 'mapa-regional';	
	
	$ErrosNaPagina = "";
	function TryShowError($ErrorStr) {
		if( !Vazio($ErrorStr) ) {
			Linha ("<p class='showerror'><b>$ErrorStr</b></p>");		
		} 
	}
	

//======= Pre-process
	//RedirectIfNotIsHTTPS(cDominioFullURLSSL . $MinhaURL); //Força HTTPS
	//Some browsers are blocking code like overpass API, claiming insecure
	RedirectIfIsHTTPS(cDominioFullURL . $MinhaURL);	 
	//session_start();
	$SemErro = FALSE;
	$SemErro = SecSessionStart($SessionName,TRUE);
	if( !$SemErro ) {	$SemErro = SecSessionStart($SessionName,FALSE);}	
	if( !$SemErro ) {	AddMsg("ErrSessStart",$ErrosNaPagina); session_start($SessionName);}	

	$IsMobileBrowser = IsMobileBrowser();

	// (geralmente, a primeira visita ao site)
	if( !isset($_SESSION['Lang']) || !isset($_SESSION['Country'])) {
	   $_SESSION['Lang']    = "pt";
	   $_SESSION['Country'] = "BR"; 
	}
	SetLanguage($_SESSION['Lang']);	


//======= Pre-process
//	Pre-action

 //exit volta ao início da página
 if (filter_has_var(INPUT_POST,'exit')) { 	
	 ClearVars(); 	 
 	 RedirecionarPHP($MinhaURL);
 }
/* elseif (...) {
 }*/
 
 
 //Baselayer foi escolhida por URL?
 if (filter_has_var(INPUT_GET,'layer')) {
 	   $SetBaseLayer = filter_input(INPUT_GET,'layer',FILTER_SANITIZE_STRING);
 }
 //Overlay foi escolhida por URL?
 if (filter_has_var(INPUT_GET,'overlay')) {
 	   $SetOverlay = filter_input(INPUT_GET,'overlay',FILTER_SANITIZE_STRING);
 }
 //Overlayer customizada foi escolhida por URL?
 if (filter_has_var(INPUT_GET,'ovlaycust')) {
 	   $TempCustomOverLay = filter_input(INPUT_GET,'ovlaycust',FILTER_SANITIZE_STRING);
 	   $ArrCustomOverLay = explode(",",$TempCustomOverLay);
 	   if( count($ArrCustomOverLay) == 2 ) {	//2 parâmetros... OK?
 	   	$CustomOverLay = $ArrCustomOverLay; 	   	 	   
 	   }
 }



?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
   <?
       Linha("	<title>".GetMsg('SiteTitle')." </title>");     
   ?>
	<link href="css/geral.css" rel="stylesheet" type="text/css"/>	
	<link href="css/map.css" rel="stylesheet" type="text/css"/>	
	<link rel="shortcut icon" href="imagens/favicon.png" type="image/png"/>
	<script src="include/funcoes.js"></script>
	<!-- Mapbox  -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js'></script>
	<link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css' rel='stylesheet' />	

	<!-- Mapbox Leaflet Locate plugin  -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.js'></script>
	<link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.css' rel='stylesheet' />	

	<!-- Mapbox Leaflet Hash plugin  -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-hash/v0.2.1/leaflet-hash.js'></script>

	<!-- Leaflet Geocoder plugin > https://github.com/perliedman/leaflet-control-geocoder -->
	<link rel="stylesheet" href="css/Control.Geocoder.css" />
	<script src="include/Control.Geocoder.js"></script>	

	<!-- Leaflet Layer OverPass plugin > https://github.com/kartenkarsten/leaflet-layer-overpass/ -->
	<link rel="stylesheet" href="css/OverPassLayer.css" />
	<script src="include/OverPassLayer.js"></script>	

	<script src='include/leafletrout.js'></script>
</head>
<body>
	<div id='map-legend'>
			<div id='map-legend-btn'></div>

			<div id='select-baselayers'>	
				Estilo de Mapa:
		      <select id='select-layer' name='select-layer' onChange='ChangeLayer();' >  
		           <option id='lMNK' value='lMNK' >OpenStreetMap</option>  
		           <option id='lMKG' value='lMKG' >OSM Tons de cinza</option>  
		           <option id='lMBL' value='lMBL' >Light Mapbox</option>  
		           <option id='lMBD' value='lMBD' >Dark Mapbox</option>
		           <option id='lOTD' value='lOTD' >Ar livre</option>
		           <option id='lMBO' value='lMBO' >Ar livre Mapbox</option>
		           <option id='lCYL' value='lCYL' >Ciclistas</option>
		           <option id='lMBB' value='lMBB' >Bike</option>
		           <option id='lMBP' value='lMBP' >Lápis</option>
		           <option id='lMBC' value='lMBC' >Comic</option>
		           <option id='lMBP' value='lMBP' >Piratas</option>
		           <option id='lSTW' value='lSTW' >Aquarela</option>
		           <option id='lSTL' value='lSTL' >Toner Light</option>
		           <option id='lSTT' value='lSTT' >Toner Dark</option>
		           <option id='lMBW' value='lMBW' >Poster Lambe-lambe</option>
		           <option id='lMBS' value='lMBS' >Satélite Mapbox</option>
		           <option id='lESR' value='lESR' >Satélite lESR</option>
		           <option id='lIBR' value='lIBR' >IBGE Rural</option>
		           <option id='lIBU' value='lIBU' >IBGE Urbano</option>
		      </select>
			</div>

			<div id='map-legend-title'>
				<a href='http://projetorgm.com.br/'><h3>Mapa do RGM</h3></a> <small>[beta]</small> | <a href='https://github.com/edilqueirozdearaujo/rgm-map'><b>Código fonte</b></a> | <a href='about.php'><b>Sobre</b></a>			
			</div>
	</div>
	<div id='geocode-selector'></div>
	<div id='mapdiv'></div>


	
	<script src='include/proc.js'></script>

	<?
		Linha("<script>");
		//Layer foi especificada por URL?
		if( isset($SetBaseLayer) ) {
			if( IsValidLayer($SetBaseLayer) ) {
					Linha("		//Layer padrão modificada por URL");	
				 	Linha("		map.eachLayer(function(layer) { map.removeLayer(layer); }); //first, remove all layers"); 				 					 	
				 	Linha("		map.addLayer(".$SetBaseLayer.");");
				 	Linha("		document.getElementById('".$SetBaseLayer."').selected = true;");				 	
			}
		}

		//Overlay foi especificada por URL?
		Linha(" ");
		if( isset($SetOverlay) ) {
			if( IsValidOverlay($SetOverlay) ) {
					Linha("		//Overlay adicionada por URL");
				 	Linha("		map.addLayer(layer_".$SetOverlay.");");
			}
		}

		//OverLayer foi especificada por URL?
		Linha(" ");
		if( isset($CustomOverLay) ) {
					Linha("		//Layer personalizada");
				 	Linha("		var layer_Custom        = L.mapbox.featureLayer('".$CustomOverLay[0]."');"); 
				 	Linha("		ControlLayers.addOverlay(layer_Custom, '".$CustomOverLay[1]."');");
				 	Linha("		map.addLayer(layer_Custom);");
		}

		Linha("	</script>");
	?>	

</body>
</html>