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
	RedirectIfNotIsHTTPS(cDominioFullURLSSL . $MinhaURL); //Força HTTPS
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
</head>
<body>

		<div class='meio'>
			<h3><a href='https://projetorgm.com.br/map/'>< VOLTAR AO MAPA</a></h3>
		   <p>Olá! O Mapa do RGM é o projeto de um mapa amigável, simples e interativo para o visitante encontrar 
		   o que procura, e mostrar o que uma região tem a oferecer.</p>
		   <p>Os dados de mapas vêm do <a href='http://openstreetmap.org/about'>OpenStreetMap</a> e as imagens do 
		   <a href='http://mapillary.com/'>Mapillary</a>. Ou seja, os dados são contribuições de pessoas de toda parte do mundo - 
		   e você é bem-vindo para participar.</p>
			<p>A ideia é experimentar as ferramentas disponíveis para criar o mapa e também compartilhar os resultados na forma de 
			código fonte como software livre. O objetivo é testar um modelo de mapa que reúna o máximo de recursos sem perder 
			a simplicidade e ao mesmo tempo ser o mais útil possível para o visitante, ao mesmo tempo divulgando e convidando
			 as pessoas a contribuírem com o mapa do OpenStreetMap e com imagens no Mapillary.</p>
			<p>Utiliza a ferramenta <a href='https://www.mapbox.com/mapbox.js'>Mapbox.js</a> e é um projeto fundado no
			 <a href='http://rede.acessasp.sp.gov.br/projeto/rgm'>portal da Rede de Projetos</a></p>
			 <p><br></p> 


			<div class='alinhar-centro'>
					<h3 class='creditos item-alinhado'><a href='https://projetorgm.com.br/rede-de-projetos/' title='Conheça a Rede de Projetos'><img src='imagens/creditos/rede-de-projetos.png'  alt=' Rede de Projetos ' /> Rede de Projetos</a></h3> 
					<h3 class='creditos item-alinhado'><a href='https://projetorgm.com.br/osm/' title='Conheça o OpenStreetMap'><img src='imagens/creditos/logo-osm.png'  alt=' OpenStreetMap ' /> OpenStreetMap</a></h3> 
					<h3 class='creditos item-alinhado'><a href='http://mapillary.com/' title='Conheça o Mapillary!'><img src='imagens/creditos/mapillary-logo.png'  alt=' Mapillary ' /></a></h3> 
					<h3 class='creditos item-alinhado'><a href='https://www.mapbox.com/design/' title='Desenvolvido com Mapbox'><img src='imagens/creditos/mapbox.png'  alt=' Mapbox.js ' /></a></h3> 
					<h3 class='creditos item-alinhado'><a href='http://bluefish.openoffice.nl/' title='Site construído usando BlueFish'><img src='imagens/creditos/bluefish.png'  alt=' BlueFish ' /> BlueFish</a></h3> 
					<h3 class='creditos item-alinhado'><a href='http://hostinger.com.br/' title='Site hospedado por Hostinger'><img src='imagens/creditos/hostinger.png'  alt=' Hostinger ' /></a></h3> 
		 	</div>

	 	</div>
	<?	
		Footer("");			
   ?>
</body>
</html>