<?
	error_reporting(1);
	ini_set("display_errors", 1 );

// Projeto RGM
// 
//
//
//

//======= Includes
include_once "include/lang.php"; 	
include_once "include/config.php"; 	
include_once "include/funcoes.php"; 	
include_once "include/db.php"; 	
include_once "include/proc.php"; 	 	


//======= Only for this page
	$MinhaURL 	   = $_SERVER['PHP_SELF'];
	$MinhaURL = NoIndexPHP($MinhaURL);	
	$SessionName = 'rgm-map';	
	

//======= Pre-process
	//RedirectIfNotIsHTTPS(cDominioFullURLSSL . $MinhaURL); //Força HTTPS
	//Some browsers are blocking code like overpass API, claiming insecure
	RedirectIfIsHTTPS(cDominioFullURL . $MinhaURL);	 
	//session_start();
	$SemErro = FALSE;
	$SemErro = SecSessionStart($SessionName,TRUE);
	if( !$SemErro ) {	$SemErro = SecSessionStart($SessionName,FALSE);}	

	$IsMobileBrowser = IsMobileBrowser();

	// (geralmente, a primeira visita ao site)
	if( !isset($_SESSION['Lang']) || !isset($_SESSION['Country'])) {
	   $_SESSION['Lang']    = "pt";
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
 
/* 
//desativando suporte por URLs

 //Baselayer foi escolhida por URL?
 if (filter_has_var(INPUT_GET,'layer')) {
 	   $SetBaseLayer = filter_input(INPUT_GET,'layer',FILTER_SANITIZE_STRING);
 }
 //Overlay foi escolhida por URL?
 if (filter_has_var(INPUT_GET,'overlay')) {
 	   $SetOverlayTemp = filter_input(INPUT_GET,'overlay',FILTER_SANITIZE_STRING);
 	   $SetOverlay = explode(";", $SetOverlayTemp);
 }
 //Overlayer customizada foi escolhida por URL?
 if (filter_has_var(INPUT_GET,'ovlaycust')) {
 	   $TempCustomOverLay = filter_input(INPUT_GET,'ovlaycust',FILTER_SANITIZE_STRING);
 	   $ArrCustomOverLay = explode(",",$TempCustomOverLay);
 	   if( count($ArrCustomOverLay) == 2 ) {	//2 parâmetros... OK?
 	   	$CustomOverLay = $ArrCustomOverLay; 	   	 	   
 	   }
 }
*/
 if (filter_has_var(INPUT_GET,'id')) {
 	 $MapID = filter_input(INPUT_GET,'id',FILTER_SANITIZE_STRING);
 	 $Mapa = SearchByID($MapID);
	 if ( $Mapa !== FALSE ){
			LoadMapSetView($Mapa['XYZ']);	//Carrega as configurações do mapa			
			if( !Vazio($Mapa['Titulo'])) { $SetMapTitulo = $Mapa['Titulo'];}
			if( !Vazio($Mapa['B'])) { $SetBaseLayer = $Mapa['B'];	}
			if(ProcessarOverlays($Mapa['O'],$OvlTemp)){ $SetOverlay = $OvlTemp;}			
			
			if(ProcessarOverlaysMB($Mapa['MB'],$OvlTemp)){ $SetOverlayMB = $OvlTemp;}			
/*			
			if( !Vazio($Mapa['MB'])) {
		 	   $TempCustomOverLay = $Mapa['MB']; //PARA CADA UM DESSES, FAZER ISSO
		 	   $ArrCustomOverLay = explode(",",$TempCustomOverLay);
		 	   if( count($ArrCustomOverLay) == 2 ) {	//2 parâmetros... OK?
		 	   	$CustomOverLay = $ArrCustomOverLay; 	   	 	   
		 	   }
			}
*/			
			
			$Tit = "";
			$Des = "";
			$Tit = $Mapa['Titulo']; 
			$Des = $Mapa['Descricao'];			
			$URL = ComporLinkHTML("http://www.projetorgm.com.br/map/?id=$MapID","Compartilhe","_parent","LINK");
			if( !Vazio($Tit) || !Vazio($Des) ){
			   $SetMapLegend = "<p><b>$Tit</b></p><p>$Des</p>" . $URL;			
			}

			
			
	 }

 }

?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
   <?	
       if( isset( $SetMapTitulo ) ) {
           Linha("	<title>" . $SetMapTitulo . " | " .  GetMsg('SiteTitle')." </title>");
       }else{ 
           Linha("	<title>".GetMsg('SiteTitle')." </title>");
       }     
   ?>
	<link href="css/geral.css" rel="stylesheet" type="text/css"/>	
	<link href="css/map.css" rel="stylesheet" type="text/css"/>	
	<link rel="shortcut icon" href="imagens/favicon.png" type="image/png"/>
	<script src="include/funcoes.js"></script>
	<!-- Mapbox  -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.js'></script>
	<link href='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css' rel='stylesheet' />
	<link href='//mapbox.com/base/latest/base.css' rel='stylesheet' />

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

	<script src="include/jquery.min.js" ></script>
	<script src='include/leafletrout.js'></script>
</head>
<body>
	<div id='geocode-selector'></div>
	<div id='mapdiv'></div>
	<div id="fb-root"></div>
	<?
		Linha("<script>");		
		Linha("		var map = L.mapbox.map('mapdiv'); //Cria o mapa");
		TryMapSetView(); //Para evitar o erro:  "Error: Set map center and zoom first"
		Linha("		var MapHash = L.hash(map);");
		Linha("</script>");		
	?>
	
	<script src='include/proc.js'></script>

	<?
		Linha("<script>");		
		//Layer foi especificada por URL?
		if( isset($SetBaseLayer) ) { TrySetBaseLayer($SetBaseLayer);}

		//Overlay foi especificada?
		Linha(" ");
		if( isset($SetOverlay) ) { MostrarOverlays($SetOverlay); }

		//Existe OverLayer customizada?
		Linha(" ");
		if( isset($SetOverlayMB) ) { MostrarOverlaysMB($SetOverlayMB); }
		
      if( isset( $SetMapLegend ) ) {
      	
			Linha("		var LegendaDoMapa = new L.mapbox.LegendControl();");
			Linha("		LegendaDoMapa.addLegend(\"".$SetMapLegend."\");");
			Linha("		LegendaDoMapa.addTo(map);");
		}

		Linha("	</script>");
	?>	
	
	
	
</body>
</html>