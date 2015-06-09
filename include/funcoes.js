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

 function PrintDiv(divID) {
     var divElements = document.getElementById(divID).innerHTML;
     var oldPage = document.body.innerHTML;
     document.body.innerHTML = 
       "<html><head><title></title></head><body>" + 
       divElements + "</body>";
     window.print();
     document.body.innerHTML = oldPage;
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
function HrefFromURLPlus(Link,Titulo,Conteudo,Alvo) {
	var TagAlvo = "";
	if ( Alvo ) {
		TagAlvo = " target='"+ Alvo +"' ";
	}
	FullLink = "<a href='" + Link + "' title='"+ Titulo + "' " + TagAlvo + " >"+ Conteudo +"</a>";
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
	var Link = "http://www.mapillary.com/map/im/18/" + Lat + "/" + Lon;
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


//Check if the map is inside of an IFRAME
//Fonte: http://pt.stackoverflow.com/questions/49538/como-pegar-a-url-da-p%C3%A1gina-pai-de-um-iframe-sem-estar-no-mesmo-dom%C3%ADnio
function MapIsEmb() {
	//document.referrer : null;
  var parentURL = window != window.parent; 
  return parentURL; 
}

