<?

$Language = 'pt';

$Msg['pt']['SiteTitle']          = "Mapa do RGM";
$Msg['pt']['ErrSessStart']       = 'Erro ao iniciar sessão de forma segura';
$Msg['pt']['NoticeBrowser']       = "Recomendado usar o navegador Mozilla Firefox ou Google Chrome";
$Msg['pt']['BtnExit']            = "Sair";
$Msg['pt']['GetSource']          = "<a href='https://github.com/edilqueirozdearaujo/rgm-map'> código-fonte</a>";


function GetMsg($Code) {
   global $Language, $Msg;
	return $Msg[$Language][$Code]; 
}



function AddMsg($Error, &$StrOut) {
	$StrOut = $StrOut . GetMsg($Error); 
}


function SetLanguage($Lang) {
  global $Language;
  $Language = $Lang;
}

//Apenas países cadastrados
function CountryFilter($Country) {
  $Temp = strtoupper($Country);
  switch( $Temp ) {
		case "BR":
		case "PT":
		case "ES":
		case "WD":	//world
			$Res     = $Temp;
		break;
		default:	
			$Res     = "BR"; 
		break;
  }    
  return $Res;
}

 

//Ref: http://www.w3schools.com/tags/ref_country_codes.asp
//     http://www.w3schools.com/tags/ref_language_codes.asp
function CountryToLanguage($Country) {
  $Lang = "";  
  switch( strtoupper($Country) ) {
		case "BR":
		case "PT":
			$Lang     = "pt";
		break;
		case "ES":
			$Lang     = "es";
		break;
		case "WD":	//world
			$Lang     = "en";
		break;
  }    
  return $Lang;
}

function CountryFull($Country) {
  $Temp = "";  
  switch( strtoupper($Country) ) {
		case "BR": $Temp = "Brazil"; break;
		case "PT": $Temp = "Portugal"; break;
		case "ES": $Temp = "Spain"; break;
		case "WD": $Temp = "World"; break;
  }    
  return $Temp;
}



?>