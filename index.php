<?
	error_reporting(1);
	ini_set("display_errors", 1 );


//======= Includes
include_once "include/lang.php"; 	
include_once "include/config.php"; 	
include_once "include/funcoes.php"; 	
include_once "include/db.php"; 	
include_once "include/proc.php"; 	 	
include_once "include/phpqrcode.php"; 	 	


//======= Only for this page
	$MinhaURL 	   = $_SERVER['PHP_SELF'];
	$MinhaURL = NoIndexPHP($MinhaURL);	
	$SessionName = 'rgm-map';	
	$MapaDefinido = 0;	

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

if (filter_has_var(INPUT_GET,'m')) {
	$MapasRecentes = filter_input(INPUT_GET,'m',FILTER_SANITIZE_STRING);
	if( $MapasRecentes < 1 ) { $MapasRecentes = 1; }
}
elseif (filter_has_var(INPUT_POST,'share-id')) {
	$Data = date("Y-m-d");
	$Hora = date("H:i:s");
	$ID  = FromBase36(filter_input(INPUT_POST,'share-id',FILTER_SANITIZE_STRING));
	$B   = filter_input(INPUT_POST,'share-b',FILTER_SANITIZE_STRING);
	$O   = filter_input(INPUT_POST,'share-o',FILTER_SANITIZE_STRING);
	$MB  = filter_input(INPUT_POST,'share-mb',FILTER_SANITIZE_STRING);
	$XYZ = filter_input(INPUT_POST,'share-xyz',FILTER_SANITIZE_STRING);
	$Tit  = filter_input(INPUT_POST,'share-tit',FILTER_SANITIZE_STRING);
	$Dsc  = filter_input(INPUT_POST,'share-dsc',FILTER_SANITIZE_STRING);

	$ExpXYZ = explode("/",$XYZ);

	$Zoom = $ExpXYZ[0];
	$Lat = $ExpXYZ[1];
	$Lon = $ExpXYZ[2];

	
	//retira o "l" no começo do nome da camada
	$B[0] = " ";
	$B = trim($B);
	
	//Novo mapa? Cadastra e pega ID
	if( $ID == 0 ) {
		$ProximoID = 0;
		$Res = DBServerConnect();
		if( DBIsConnected($Res)) {
			if (DBSelect(cDBName)){
				$ProximoID = GetNextTableID("RGMMap");					
				$SQL = "INSERT INTO RGMMap (B,O,MB,Lat,Lon,Zoom,Data,Hora,Titulo,Descricao) VALUES ('$B','$O','$MB','$Lat','$Lon','$Zoom','$Data','$Hora','$Tit','$Dsc');";
				$ExeSQL = mysql_query($SQL);
			}
			DBServerDisconnect($Res);			
		}
	}else {
		$ProximoID = $ID;
	}

	if( $ProximoID != 0 ) {
		$CompartilharMapa["ID"] = ToBase36($ProximoID);
	}		
}
elseif (filter_has_var(INPUT_GET,'id')) {
 	 $MapID = filter_input(INPUT_GET,'id',FILTER_SANITIZE_STRING);
 	 $Mapa = SearchByID($MapID);
	 if ( $Mapa !== FALSE ){
	 		$MapaDefinido = $MapID;
	 		
	 		//$Mapa['XYZ'] = $Mapa['Zoom'] . "/"  . $Mapa['Lat'] . "/" . $Mapa['Lon'];	 		  	 		
	 		
			LoadMapSetView($Mapa['XYZ']);	//Carrega as configurações do mapa			
			if( !Vazio($Mapa['Titulo'])) { $SetMapTitulo = $Mapa['Titulo'];}
			if( !Vazio($Mapa['B'])) { $SetBaseLayer = $Mapa['B'];	}
			if(ProcessarOverlays($Mapa['O'],$OvlTemp)){ $SetOverlay = $OvlTemp;}			
			
			if(ProcessarOverlaysMB($Mapa['MB'],$OvlTemp)){ $SetOverlayMB = $OvlTemp;}			
			
			$Tit = "";
			$Des = "";
			$Tit = $Mapa['Titulo']; 
			$Des = $Mapa['Descricao'];			
			if( !Vazio($Tit) || !Vazio($Des) ){
			   $SetMapLegend = "<p><b>$Tit</b></p><p>$Des</p>";			
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
<?
if(isset($MapasRecentes)){
Linha("<!--entrou no comando-->");	
	$Ini = 0 + (cMapasPorPagina * ($MapasRecentes - 1));
	$Fin = $Ini + cMapasPorPagina;	
	MostrarMapasRecentes($Ini,$Fin);		
}
elseif(isset($CompartilharMapa)){	
	CompartilharMapa($CompartilharMapa['ID']);	
}
else{
 	Linha("<div id='geocode-selector'></div>");
 	Linha("<div id='mapdiv'></div>");
	Linha("<script>");		
	Linha("		var RawOverlaysMB = []; //Overlays como dados brutos");		
	Linha("		var OverlaysMB = []; //Feature layers");		
	Linha("		var map = L.mapbox.map('mapdiv'); //Cria o mapa");
	TryMapSetView(); //Para evitar o erro:  "Error: Set map center and zoom first"
	Linha("		var MapHash = L.hash(map);");
	Linha("		lMNK.addTo(map);");  
	Linha("</script>");		
	Linha("<script src='include/proc.js'></script>");
	Linha("<script>");
		//Layer foi especificada por URL, ou usará camada padrão?
		if( isset($SetBaseLayer) ) { TrySetBaseLayer($SetBaseLayer);}
		
		//Se mapa for especificado, grava o ID do mapa para caso de usar o botão Share
		if( FromBase36($MapaDefinido) > 0 ) {
			//Linha("		$('#share-id').value = $MapaDefinido; ");
			Linha("		document.getElementById('share-id').value = '$MapaDefinido';");
		}
				
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

		//Em caso de baselayer, este fix neste local cuida de mudar o select para a opção correta.		
		if( isset($SetBaseLayer) && IsValidLayer($SetBaseLayer) ){
			Linha("		if( map.hasLayer(l".$SetBaseLayer.") ){document.getElementById('map-select-layer').value = 'l".$SetBaseLayer."';}");
		}
		Linha("	</script>");
}	
		
?>	
	
	
</body>
</html>