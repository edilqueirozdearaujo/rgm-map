<?
error_reporting(1);
ini_set("display_errors", 1 );

define("cSiteRGM","<a href='http://projetorgm.com.br/'><img class='alinhar-vertical' src='imagens/favicon.png' width='32px' /> projetorgm.com.br</a>");
define("cMapasPorPagina",200);
define("cURLBase", "http://www.projetorgm.com.br/map/");


//MAP OPTIONS ------------------------------------------------------------------------------------------ 
$MapSetView["Lat"] = "-24.1267";
$MapSetView["Lon"] = "-48.3721";
$MapSetView["Zoom"] = "10";




function IsValidLayer($Test){
	$IsLayer = FALSE;
	$Test = $Test . ",";	
	$Layers = "lMNK,lMKG,lMBL,lMBD,lMBS,lMBT,lMBO,lMBB,lMBP,lMBC,lMBR,lMBW,lOTD,lCYL,lLSC,lTPD,lSTW,lSTL,lSTT,lIBR,lIBU,";
	
	if( StrPosicao($Test,$Layers) > 0 ) {
		$IsLayer = TRUE;
	} 
	return $IsLayer;
}


function IsValidOverlay($Test){
	$IsLayer = FALSE;
	$Test = $Test . ",";
	$Layers = "Mapillary,MPLL,NASC,";
	if( StrPosicao($Test,$Layers) > 0 ) {
		$IsLayer = TRUE;
	} 
	return $IsLayer;
}


//Escreve um trecho javascript que define o mapa de fundo
function TrySetBaseLayer($SetBaseLayer) {
	if( IsValidLayer($SetBaseLayer) ) {
			Linha("		//Layer padrão modificada por URL");	
		 	Linha("		RmBaseLayers(); //first, remove all baselayers"); 				 					 	
		 	Linha("		map.addLayer(l".$SetBaseLayer.");");
	}
}

function LoadMapSetView($XYZ) {
	global $MapSetView;
	if( !Vazio($XYZ) ) {
		//$XYZ = explode("/", $Dados);	
		$MapSetView["Lat"]  = $XYZ["Lat"];
		$MapSetView["Lon"]  = $XYZ["Lon"];
		$MapSetView["Zoom"] = $XYZ["Zoom"];
	}
}

//Escreve um trecho javascript que define coordenadas e zoom do mapa
function TryMapSetView() {
	global $MapSetView;	
	Linha ("		map.setView([".$MapSetView["Lat"].",".$MapSetView["Lon"]."], ".$MapSetView["Zoom"].");");
}


function ProcessarOverlays($OvlBruta,&$Resultado) {
	$SemErro = FALSE;
	if (!Vazio($OvlBruta)) {
		$OverlaysArr = explode(";",$OvlBruta);
		$Resultado = $OverlaysArr;
		$SemErro = TRUE;
	}
	return $SemErro;
}

//Cada overlay Mapbox é um array de chave/id e título
//A fazer: tratar para que opções inválidas de grupos sejam adicionadas
function ProcessarOverlaysMB($OvlBruta,&$Resultado) {
	$SemErro = FALSE;
	if (!Vazio($OvlBruta)) {
		$OverlaysArr = explode(";",$OvlBruta);
		foreach( $OverlaysArr as &$CadaLMB ){
		 	   $ArrCadaLMB = explode(",",$CadaLMB);
		 	   if( count($ArrCadaLMB) >= 2 ) {	//2 parâmetros... OK?
		 	   	$OverLaysMB[] = $ArrCadaLMB;
		 	   	$SemErro = TRUE; 	   	 	   
		 	   }
		}

		$Resultado = $OverLaysMB;
		$SemErro = TRUE;
	}
	return $SemErro;
}


function MostrarOverlays($SetOverlay) {
	foreach($SetOverlay as &$OvlTemp ){
		if( IsValidOverlay($OvlTemp) ) {
				Linha("		//Overlay adicionada por URL");
			 	Linha("		map.addLayer(ol".$OvlTemp.");");
			 	switch($OvlTemp) {
			 		case "MMA": Linha("		ControlLayers.addOverlay(ol".$OvlTemp.", 'MMA');"); 
			 		break;
			 		case "MBH": Linha("		ControlLayers.addOverlay(ol".$OvlTemp.", 'Microbacias');"); 
			 		break;
			 	}
		}				
	}									
}


function MostrarMapasRecentes($From,$Limit) {
	function Botao($URL,$Conteudo) {
		Linha(" <p class='round cleafix fill-lighten1 col3 row2 margin0'><a class='fr button fill-green icon osm' href='$URL'>Abrir</a> <span class='pad0'>$Conteudo</span> </p> ");
	
	}	
	function BotaoNav($Conteudo,$Icon) {
		$ModoIcon = 'icon';
		if( Vazio($Icon) ) {
			$ModoIcon = '';		
		}
		Linha("<a class='button $ModoIcon $Icon dot botao-paginador' href='#'>$Conteudo</a>");	
	}	

	$BaseURL = cURLBase;

	Linha("<div class='pad2 fill-darken3 dark'>");
	Linha("		<a class='inline icon prev big button space' href='$BaseURL' id='voltar-ao-mapa' >VOLTAR AO MAPA</a>");
	Linha("		<h3 class='inline fancy' >Galeria dos mapas que já foram feitos</h3>");
	Linha("</div>");
	
	Linha("<div class='pad1 dark center'>");

	$Res = DBServerConnect();
	if( DBIsConnected($Res)) {
		if (DBSelect(cDBName)){
				$SQL = "SELECT * FROM RGMMap LIMIT $From , $Limit ;";
			
				$ExeSQL = mysql_query($SQL) or die (mysql_error());;
				$Total = MySQLResults($ExeSQL);
				if( $Total > 0 ) {
					for( $Cont = 0; $Cont < $Total; $Cont++ ) {
					 	$Resultado = mysql_fetch_array($ExeSQL);
					 	$URL = $BaseURL . "?id=" . ToBase36($Resultado['ID']);					 	
					 	Botao($URL,$Resultado['Titulo']);
					 	
					}
					 
				}		
		}
		DBServerDisconnect($Res);					
	}
	Linha("</div>");

/*	Linha("	<div class='pad2'>");
	Linha("	<div class='center'>");
	BotaoNav('','prev');		
	$Total = 5;
	for( $Cont = 0; $Cont < $Total; $Cont++ ) {
		BotaoNav($Cont,'');		
	}
	BotaoNav('','next');		
	Linha("	</div>");
	Linha("	</div>");	
	Linha("	<script src='include/proc-recent.js'></script>");
*/	
	
	Footer();
}

function MostrarOverlaysMB($SetOverlay) {
	Linha("		//Layers mapbox");
	foreach($SetOverlay as &$OvlTemp ){
		$MBGroup = "";
		$MBID    = $OvlTemp[0];		 
		$MBTitle = $OvlTemp[1];
		$MBGroup = $OvlTemp[2];
		if( !Vazio($MBGroup) ) {
			$MBGroup = ",".$MBGroup;
		}

//		$MBName =  TrocarCaractere($MBID,".","_" ); 		
//	 	Linha("		var $MBName        = L.mapbox.featureLayer('$MBID');"); 
//	 	Linha("		ControlLayers.addOverlay($MBName, '$MBTitle');");
//	 	Linha("		map.addLayer($MBName);");
		Linha("		AddMBLayerInTheMap('$MBID,$MBTitle"."$MBGroup');");
	}									
}



//HTML OPTIONS ------------------------------------------------------------------------------------------ 




function Footer(){
/*
	Linha("<div class='prose clearfix col12 center dark'>");
   Linha(	cSiteRGM );
	Linha(" 	<a class='pad1' href='".GetMsg('GetSource'))."'><span class='icon big github'>Source</span></a>");
	Linha("	<a href='http://projetorgm.com.br/rede-de-projetos/' title='Conheça a Rede de Projetos'><img src='imagens/creditos/rede-de-projetos.png'  alt=' Rede de Projetos ' /> Uma iniciativa fundada na Rede de Projetos</a>");
	Linha(" 	<a class='pad1' href='https://www.mapbox.com/base'><span class='icon big mapbox'>Mapbox style</span></a>");
	Linha("</div>");
*/	
}


//SHARE OPTIONS ------------------------------------------------------------------------------------------ 
function CompartilharMapa($M){
	$BaseURL = cURLBase; 

	$ID = $M['ID'];
	$IDNum = FromBase36($ID); 
	if( $IDNum == 0 ) {
		$MapURL = $BaseURL . "?layer=".$M['B']."#".$M['Zoom']."/".$M['Lat']."/".$M['Lon'];
	}else {
		$MapURL = $BaseURL . "?id=$ID";	 
	}
	
	$Embed = "<iframe src=\"".$MapURL."\" width=\"425\" height=\"350\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" ></iframe>" ;
	Linha("<h3><a class='icon prev big button' href='$MapURL' id='voltar-ao-mapa' >VOLTAR AO MAPA</a></h3>");
	Linha("<div class='alinhar-centro'>");

	Linha("<p>Compartilhe este mapa</p>");
	Linha("<p>Link: <input type='text' size='60' onclick='this.select();' value='$MapURL' ></p>");
	Linha("<p>Embutir:<br><textarea cols='60' onclick='this.select();' >$Embed</textarea></p>");
	Linha("	<div class='inline'>");	TwitterShare($BaseURL);	Linha("	</div>"); 
	Linha("	<div class='inline'>");	FBShare($BaseURL); Linha("	</div>"); 

	//QR somente para mapas salvos
	if( $IDNum != 0 ) {
	   $FileName =  "share/" . $ID . '.png';
	   $URL = $MapURL;
	   $QRCodeW = 6;
	   if( !file_exists($FileName) ) {
			QRcode::png($URL,$FileName, "M", $QRCodeW, 2);
		}	  	
		Linha("<p></br></p>");
		Linha("<p>QR Code:<br><img src='$FileName' alt='QR Code'></p>");
	}
	
	Linha("</div>");
}

function TwitterShare($URL) {
	Linha("		");
	Linha("		<a class='twitter-share-button' href='$URL'");
	Linha("		  	data-related='twitterdev'");
//	Linha("		  	data-size='large'");
	Linha("		  	data-count='horizontal'>");
	Linha("		Share");
	Linha("		</a>");
	Linha("		<script type='text/javascript'>");
	Linha("		window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return}js=d.createElement(s);js.id=id;js.src='https://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,'script','twitter-wjs'));");
	Linha("		</script>");
}


function FBShare($URL) {
	Linha("		<div id='fb-root'></div>");
	Linha("		<script>(function(d, s, id) {");
	Linha("		  var js, fjs = d.getElementsByTagName(s)[0];");
	Linha("		  if (d.getElementById(id)) return;");
	Linha("		  js = d.createElement(s); js.id = id;");
	Linha("		  js.src = '//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.0';");
	Linha("		  fjs.parentNode.insertBefore(js, fjs);");
	Linha("		}(document, 'script', 'facebook-jssdk'));</script>");
	Linha("<div class='fb-share-button' data-href='$URL' data-layout='button_count'></div>");
}

?>