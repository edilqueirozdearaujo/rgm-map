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
//	$MinhaURL 	   = $_SERVER['PHP_SELF'];
//	$MinhaURL = NoIndexPHP($MinhaURL);	
	$MapaDefinido = 0;	
	$MinhaURL = "/map/";

	SecSessionStart('rgm-map',FALSE);
 

 //Baselayer foi escolhida por URL?
 //Baselayer pode ser sobrescrita se ID for especificado
 if (filter_has_var(INPUT_GET,'layer')) {
 	   $SetBaseLayer = filter_input(INPUT_GET,'layer',FILTER_SANITIZE_STRING);
 }

/* 
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
//Mecanismo para evitar reenvio do método POST
if( isset($_SESSION['FormSubmit']) ) {
	unset($_SESSION['FormSubmit']);
	$Rdr = '';
	if( isset($_SESSION['FormSubmitID']) ) {
		 $Rdr = "?id=".$_SESSION['FormSubmitID']; 
		  unset($_SESSION['FormSubmitID']);
	}
	RedirecionarPHP($MinhaURL . $Rdr);				
}
elseif (filter_has_var(INPUT_GET,'pg')) {
	$MapasRecentes = filter_input(INPUT_GET,'pg',FILTER_SANITIZE_STRING);
	if( $MapasRecentes < 1 ) { $MapasRecentes = 1; }
}
//Opção compartilhar:
//Ao compartilhar o mapa, o título é opcional. 
//   Com título o mapa é salvo no banco de dados, e assim é possível obter um ID e salvar as camadas
//   Sem título compartilha apenas coordenadas e camada ativa   
elseif (filter_has_var(INPUT_POST,'share-id')) {
	//Mecanismo para evitar reenvio do método POST
	$_SESSION['FormSubmit'] = TRUE;	
		
	
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
	
	
	$ProximoID = 0;				 
	//Novo mapa? Cadastra e pega ID (além de zero, DEVE TER um título)
	if( $ID == 0) {
		if(Vazio($Tit)){
			$CompartilharMapa["ID"]   = 0;		//Caso especial, define valor para zero
			$CompartilharMapa["Zoom"] = $Zoom;		
			$CompartilharMapa["Lat"]  = $Lat;		
			$CompartilharMapa["Lon"]  = $Lon;		
			$CompartilharMapa["B"]    = $B;		
		}else {
			$Res = DBServerConnect();
			if( DBIsConnected($Res)) {
				if (DBSelect(cDBName)){
					$ProximoID = GetNextTableID("RGMMap");	
					$_SESSION['FormSubmitID'] = ToBase36($ProximoID);				
					$SQL = "INSERT INTO RGMMap (B,O,MB,Lat,Lon,Zoom,Data,Hora,Titulo,Descricao) VALUES ('$B','$O','$MB','$Lat','$Lon','$Zoom','$Data','$Hora','$Tit','$Dsc');";
					$ExeSQL = mysql_query($SQL);
				}
				DBServerDisconnect($Res);			
			}
		}		
		
	}
	else {
		$ProximoID = $ID;				 
	}
	
	if( $ProximoID != 0 ) { 	//DEPRECATED
		$CompartilharMapa["ID"] = ToBase36($ProximoID);
	}			
}
elseif (filter_has_var(INPUT_GET,'id')) {
 	 $MapID = filter_input(INPUT_GET,'id',FILTER_SANITIZE_STRING);
 	 $Mapa = SearchByID($MapID);
	 if ( $Mapa !== FALSE ){
	 		$MapaDefinido = $MapID;
	 		
	 		//$Mapa['XYZ'] = $Mapa['Zoom'] . "/"  . $Mapa['Lat'] . "/" . $Mapa['Lon'];	 		  	 		
	 		
			LoadMapSetView($Mapa);	//Carrega as configurações do mapa			
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
	<link href="css/map.css" rel="stylesheet" type="text/css"/>	
	<link rel="shortcut icon" href="imagens/favicon.ico" type="image/x-icon"/>
	<!-- Mapbox  -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.js'></script>
	<link href='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css' rel='stylesheet' />
	<link href='//mapbox.com/base/latest/base.css' rel='stylesheet' />
	<script> 
		L.mapbox.accessToken   = "";
		var MapillaryID =	""; //https://a.mapillary.com/  
	</script>

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

	<!-- Leaflet Heat plugin > https://github.com/kartenkarsten/leaflet-layer-overpass/ -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-heat/v0.1.3/leaflet-heat.js'></script>

	<!-- Leaflet MarkerCluster plugin > https://github.com/kartenkarsten/leaflet-layer-overpass/ -->
	<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js'></script>
	<link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css' rel='stylesheet' />
	<link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css' rel='stylesheet' />

	<script src="include/jquery.min.js" ></script>
	<script src='include/providers.js'></script>
	<script src="include/funcoes.js"></script>

</head>
<body class="fill-dark">	
<div id='print-options' class='col12 limiter pad2 center dark'>
	<form id='map-page-form' method='post' >
		<a href='#' class='button icon big printer map-btn-print' >Imprimir</a>
		<a href='#' class='button icon big close fill-red margin2 map-btn-print-cancel' >Cancelar</a>
		<span class="caption pad0">Tamanho recomendado para impressão: A4</span>
		<input id='map-page-form-submit' name='map-page-form-submit' type='hidden' value='0'>	
	</form>
</div>
<?
if(isset($MapasRecentes)){	
	$Ini = 0 + (cMapasPorPagina * ($MapasRecentes - 1));
	$Fin = $Ini + cMapasPorPagina;	
	MostrarMapasRecentes($Ini,$Fin);		
}
elseif(isset($CompartilharMapa)){	
	CompartilharMapa($CompartilharMapa);	
}
else{
 	Linha("<div id='geocode-selector'></div>");
 	Linha("<div id='print-area' class='page-A4' >");
 	Linha("		<div id='map' class='map-print' ></div>");
 	Linha("</div>");
	Linha("<script>");		
	Linha("		var HeatLayer = L.heatLayer([], { minZoom: 5, maxZoom: 17 });");		
	Linha("		var ClusterLayer = new L.MarkerClusterGroup();");		
	
	Linha("		var RawOverlaysMB = []; //Overlays como dados brutos");		
	Linha("		var OverlaysMB = []; //Feature layers");		
	Linha("		var map = L.mapbox.map('map'); //Cria o mapa");
//	Linha("		map.MaxZoom = 19;");
//	Linha("		map._layersMaxZoom=19;");
	Linha("		map.options.maxZoom = 19;");
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
		if( isset($SetOverlayMB) ) { MostrarOverlaysMB($SetOverlayMB);}
//		else { TryMapSetView(); }
		
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
<script>
	ControlGeocoder.removeFrom(map);
	LocateControl.removeFrom(map);
	ControlesDoMapa.removeFrom(map);
	ControlLayers.removeFrom(map);
	map.attributionControl.addAttribution("RGM Map");
	//ControlesDoMapa.removeLegend(MapBaseLayersSelect);
	//ControlesDoMapa.addLegend(SelectLayersList);
	ModoImpressao = true;
	
	
	$(".map-btn-print").click(function(e){
    		e.preventDefault();
//
//			PrintDiv("print-area");
//    		return false;
    		
//alert('HELLO!!');    		
	});
	$(".map-btn-print-cancel").click(function(e) {						
			$("#map-page-form").submit();
	}) 
</script>
	
	
</body>
</html>