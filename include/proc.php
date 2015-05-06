<?

 define("cSiteRGM","<a href='https://projetorgm.com.br/'><img class='alinhar-vertical' src='imagens/favicon.png' width='32px' /> projetorgm.com.br</a>");

function IsValidLayer($Test){
	$IsLayer = FALSE;
	$Test = $Test . ",";

//	$Layers = "mapnik,OSMbw,outdoors,cycle,ESRI,IBGEr,IBGEu,MapBox,StamenWater,StamenToner,StamenTonerL"
//			  . ",MapboxComic,MapboxStreets,MapboxLight,MapboxDark,MapboxOutdoors,MapboxPirates,MapboxWheatpaste,MapboxBike,MapboxPencil";
	
	
	$Layers = "lMNK,lMKG,lOTD,lCYL,lESR,lIBR,lIBU,lSTW,lSTT,lSTL,lMBC,lMBS,lMBL,lMBD,lMBO,lMBP,lMBW,lMBB,lMBR,";
	
	//Novas layers aqui!!!!!!!!!!!!!!!! //
	if( StrPosicao($Test,$Layers) > 0 ) {
		$IsLayer = TRUE;
	} 
	return $IsLayer;
}


function IsValidOverlay($Test){
	$IsLayer = FALSE;
	$Test = $Test . ",";
	$Layers = "Mapillary,";
	if( StrPosicao($Test,$Layers) > 0 ) {
		$IsLayer = TRUE;
	} 
	return $IsLayer;
}


function ItemDivNav($Texto) {
		Linha("<div id='navegacao_horizontal' class='caixas-arredondadas'>");	
		Linha($Texto);
		Linha("</div>");
}



function DrawHeader($MinhaURL) {
	Linha("<div class='header alinhar-direita'>");
	Linha( "		<h1 class='item-alinhado alinhar-centro' >".GetMsg('IntroTitle')."</h1>" );
   Linha("		<p class='item-alinhado itempadl' >".cSiteRGM."</p>");
   Linha("		<form id='formlang' class='item-alinhado itempadl' action='$MinhaURL' method='post'>");
   Linha("					<p class='item-alinhado'><img src='imagens/country-translate.png' alt='country...'/></p>");
   Linha("					<div class='item-alinhado langescolha' onclick=\"CheckElement('country-br',true);document.getElementById('formlang').submit();\" ><img src='imagens/country-br.png' title='Brasil, Português' ><br><input hidden='true' id='country-br' type='radio' name='country' value='BR'></div>");									
   Linha("     			<div class='item-alinhado langescolha' onclick=\"CheckElement('country-wd', true);document.getElementById('formlang').submit();\" ><img src='imagens/country-wd.png'   title='World, English'><br>   <input hidden='true' id='country-wd' type='radio' name='country' value='WD'></div>");
   Linha("     			<div class='item-alinhado langescolha' onclick=\"CheckElement('country-es', true);document.getElementById('formlang').submit();\" ><img src='imagens/country-es.png'   title='España, Español'><br>   <input hidden='true' id='country-es' type='radio' name='country' value='ES'></div>");
   Linha("		</form>");									
   Linha(" ");									

	Linha("</div>");
   Linha(" ");									
}


function Footer() {
   Linha("	<div class='footer'>");
   Linha("		<p class='alinhar-centro'> " . cSiteRGM . " | <img class='alinhar-vertical' src='imagens/icons/git-w.png' /> " . GetMsg('GetSource')."</p>");
   Linha("	</div>");
   Linha(" ");									
}


function GetIDURL($MinhaURL,$ID) {
	return cDominioFullURLSSL . $MinhaURL."?id=".$ID;	
}

function ClearVars() {
// 	 if( isset($_SESSION['CalendarioTipoEscolhido']) ) { unset($_SESSION['CalendarioTipoEscolhido']); }
 	 if( isset($_SESSION['CustomLayer']) ) { unset($_SESSION['CustomLayer']); }
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