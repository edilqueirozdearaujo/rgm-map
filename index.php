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

	//Se não tiver configurado país, linguagem e tipo de calendário, configura e redireciona 
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
/* elseif (filter_has_var(INPUT_POST,'country')) {
		$Pais = filter_input(INPUT_POST,'country',FILTER_SANITIZE_STRING);
		$Country = CountryFilter($Pais);
		$Lang    = CountryToLanguage($Country);		
	   $_SESSION['Lang']    = $Lang;
	   $_SESSION['Country'] = $Country; 
		RedirecionarPHP($MinhaURL);
 }*/
 elseif (filter_has_var(INPUT_GET,'id')) {
 	   //Prevent first step
 	   ClearVars(); 
 	   
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
	<div id='map-legend'></div>
	<div id='geocode-selector'></div>
	<div id='mapdiv'></div>


	
	<script src='include/proc.js'></script>

</body>
</html>