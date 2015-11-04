function WriteInside(valor,elemID) {
   var Elemento = document.getElementById(elemID);
   Elemento.innerHTML = valor;
}

function CheckElement(ElemID,condicao) {
   var Elemento = document.getElementById(ElemID);
	if (condicao) {
		Elemento.checked = true;
	}else {
		Elemento.checked = false;
	}
}

function EmUpperCase(obj){
	obj.value = obj.value.toUpperCase();
}	


//source = http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
function GetScreenHeight() {
	//Por alguma razão, mantendo estas variváveis e a consulta o valor é retornado corretamente | Verificar isso
	var avw = window.screen.availWidth,
		 avh = window.screen.availHeight;	
   return window.innerHeight;
}


//+ opção target=''
function HrefFromURLPlus(Link,Classe,Titulo,Conteudo,Alvo) {
	var TagAlvo = "";
	if ( Alvo ) {
		TagAlvo = " target='"+ Alvo +"' ";
	}
	FullLink = "<a href='" + Link + "' class='" + Classe + "' title='"+ Titulo + "' " + TagAlvo + " >"+ Conteudo +"</a>";
	return FullLink;
}


function HrefFromURL(Link,Titulo,Conteudo) {
	FullLink = HrefFromURLPlus(Link,Titulo,Conteudo,"");
	return FullLink;
}


function GetLinkOSMR(Lat,Lon) {
	var Link = "http://map.project-osrm.org/?hl=pt&loc=-23.505175,-46.853432&loc=" + Lat + "," + Lon + "&z=17&center=" + Lat + "," + Lon + "&alt=0&df=0&re=0&ly=-1171809665";
	return Link;
}

function GetLinkMapillary(Lat,Lon) {
//	var Link = "http://www.mapillary.com/map/im/18/" + Lat + "/" + Lon;
	var Link = "http://www.mapillary.com/map/search/" + Lat + "/" + Lon + "/13";
	return Link;
}

function GetLinkF4Map(Lat,Lon) {
	var Link = "http://demo.f4map.com/#lat=" + Lat + "&lon=" + Lon + "&zoom=19&camera.theta=58.465";
	return Link;
}


function GetLinkOSMe(Lat,Lon) {
	var Link = "http://www.openstreetmap.org/edit#map=18/" + Lat + "/" + Lon;
	return Link;
}

function GetLinkOSMd(Lat,Lon) {
	var Link = "http://www.openstreetmap.org/#map=17/" + Lat + "/" + Lon + "&layers=D";
	return Link;
}

//Recent edits: last 90 days - ito! map
function GetLinkLast90Edits(Lat,Lon) {
	var Link = "http://www.itoworld.com/map/129?lon="+ Lon + "&lat="+ Lat + "&zoom=14";
	return Link;
}


function GetLinkEcoMap(Lat,Lon) {
	var Link = "http://mapaecologico.com.br/?coord=" + Lat + "|" + Lon + "|11";
	return Link;
}


function GetLinkNote(Lat,Lon) {
	var Link = "http://www.openstreetmap.org/note/new#map=14/" + Lat + "/" + Lon;
	return Link;
}


//Check if the map is inside of an IFRAME
//Fonte: http://pt.stackoverflow.com/questions/49538/como-pegar-a-url-da-p%C3%A1gina-pai-de-um-iframe-sem-estar-no-mesmo-dom%C3%ADnio
function MapIsEmb() {
	//document.referrer : null;
  var parentURL = window != window.parent; 
  return parentURL; 
}


function AttrIfLayerIsOn( Camada, Attr ) {
	if ( map.hasLayer( Camada )) {			
	     map.attributionControl.addAttribution(Attr);
	}else {
	     map.attributionControl.removeAttribution(Attr);
	}	
}

function RmIfLIsOn( Camada ) {
	if ( map.hasLayer( Camada )) {
	      map.removeLayer(Camada);
	}	
}


//Precisa ser escrita de uma forma mais prática, mas tá funcionando por enquanto :P
function RmBaseLayers() {
	RmIfLIsOn( lMNK );
	RmIfLIsOn( lMKG );
	RmIfLIsOn( lMBL );
	RmIfLIsOn( lMBD );
	RmIfLIsOn( lOTD );
	RmIfLIsOn( lMBO );
	RmIfLIsOn( lCYL );
	RmIfLIsOn( lLSC );
	RmIfLIsOn( lTPD );
	RmIfLIsOn( lMBB );
	RmIfLIsOn( lMBP );
	RmIfLIsOn( lMBC );
	RmIfLIsOn( lMBR );
	RmIfLIsOn( lSTW );
	RmIfLIsOn( lSTL );
	RmIfLIsOn( lSTT );
	RmIfLIsOn( lMBW );
	RmIfLIsOn( lMBS );
	RmIfLIsOn( lMBT );
	RmIfLIsOn( lIBR );
	RmIfLIsOn( lIBU );
}
