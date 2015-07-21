//initialization ************************************************************
var MapBaseLayersSelect = "<span class='icon layers'></span>"
		+"<select id='map-select-layer' >"
			+"<option id='lMNK' value='lMNK' >OpenStreetMap</option>"  
			+"<option id='lMKG' value='lMKG' >OSM Tons de cinza</option>"
			+"<option id='lMBL' value='lMBL' >Light Mapbox</option>"  
			+"<option id='lMBD' value='lMBD' >Dark Mapbox</option>"
			+"<option id='lOTD' value='lOTD' >Ar livre</option>"
			+"<option id='lMBO' value='lMBO' >Ar livre Mapbox</option>"
			+"<option id='lCYL' value='lCYL' >Ciclistas</option>"
			+"<option id='lMBB' value='lMBB' >Bike</option>"
			+"<option id='lMBP' value='lMBP' >Lápis</option>"
			+"<option id='lMBC' value='lMBC' >Comic</option>"
			+"<option id='lMBR' value='lMBR' >Piratas</option>"
			+"<option id='lSTW' value='lSTW' >Aquarela</option>"
			+"<option id='lSTL' value='lSTL' >Toner Light</option>"
			+"<option id='lSTT' value='lSTT' >Toner Dark</option>"
			+"<option id='lMBW' value='lMBW' >Poster Lambe-lambe</option>"
			+"<option id='lMBS' value='lMBS' >Satélite Mapbox</option>"
			+"<option id='lESR' value='lESR' >Satélite lESR</option>"
			+"<option id='lIBR' value='lIBR' >IBGE Rural</option>"
			+"<option id='lIBU' value='lIBU' >IBGE Urbano</option>"
		+"</select><div id='map-controls-group'></div>";


var LinksAlvo = "";
var MapControlsInner = "";     //HTML que vai dentro do LegendControl ControlesDoMapa
var MapNotesPrev = "";  //Para remover a cada atualização
var MapaEmbutido = MapIsEmb();
//Os links dos botões devem abrir fora do iframe ou quadro onde o mapa foi embutido
if ( MapaEmbutido ) {
  LinksAlvo = '_parent';  
}

//var map = L.mapbox.map('mapdiv'); //Cria o mapa DEPRECATED

//var legendNotes = new L.mapbox.LegendControl();
var ControlesDoMapa = new L.mapbox.LegendControl({collapsed :true, position: 'topright'});
ControlesDoMapa.addTo(map);
ControlesDoMapa.addLegend(MapBaseLayersSelect); //A seleção das camadas do mapa não devem ser mudadas ao mover o mapa


function ChangeLayer(Opcao) {
	//Transforma Opcao (string) em layer
	switch( Opcao ) {
		case 'lMNK' : sLayer = lMNK; break;	
		case 'lMKG' : sLayer = lMKG; break;	
		case 'lMBL' : sLayer = lMBL; break;
		case 'lMBD' : sLayer = lMBD; break;	
		case 'lOTD' : sLayer = lOTD; break;	
		case 'lMBO' : sLayer = lMBO; break;	
		case 'lCYL' : sLayer = lCYL; break;	
		case 'lMBB' : sLayer = lMBB; break;	
		case 'lMBP' : sLayer = lMBP; break;	
		case 'lMBC' : sLayer = lMBC; break;	
		case 'lMBR' : sLayer = lMBR; break;	
		case 'lSTW' : sLayer = lSTW; break;	
		case 'lSTL' : sLayer = lSTL; break;	
		case 'lSTT' : sLayer = lSTT; break;	
		case 'lMBW' : sLayer = lMBW; break;	
		case 'lMBS' : sLayer = lMBS; break;	
		case 'lESR' : sLayer = lESR; break;	
		case 'lIBR' : sLayer = lIBR; break;	
		case 'lIBU' : sLayer = lIBU; break;	
	}	
	
	//remove camadas existentes
	RmBaseLayers(); //Apenas as baselayers, preserve as overlays
	//map.eachLayer(function(layer) { map.removeLayer(layer); });
/*
    if (map.hasLayer(sLayer)) {
            map.removeLayer(sLayer);
            this.className = '';
    } else {
            map.addLayer(sLayer);
            this.className = 'active';
    }
*/    	
   map.addLayer(sLayer);
}


function MakeMapControls(Links) {
	$("#map-controls-group").html(Links);
}


function AtualizarControlesDoMapa() {
	//pega coordenadas
	var Cnt = map.getCenter();
	var Lat = Cnt.lat;
	var Lon = Cnt.lng;
	
	PreLinkOSMR      = GetLinkOSMR(Lat,Lon); 
	PreLinkMapillary = GetLinkMapillary(Lat,Lon);
	PreLinkF4Map     = GetLinkF4Map(Lat,Lon);
	PreLinkEcoMap    = GetLinkEcoMap(Lat,Lon);
	PreLinkOSMe      = GetLinkOSMe(Lat,Lon);
	PreLinkOSMd      = GetLinkOSMd(Lat,Lon);
	PreLinkLast90    = GetLinkLast90Edits(Lat,Lon);
	
	LinkOSMR      = HrefFromURLPlus(PreLinkOSMR,"icon l-r-arrow","Como chegar até aqui","",LinksAlvo);
	LinkMapillary = HrefFromURLPlus(PreLinkMapillary,"icon street","Fotos e streetview","",LinksAlvo);
	LinkF4Map  = HrefFromURLPlus(PreLinkF4Map,"icon mt","Veja em 3D","",LinksAlvo);
	LinkEcoMap = HrefFromURLPlus(PreLinkEcoMap,"icon landuse","Mapa ecológico","",LinksAlvo);
	LinkOSMe   = HrefFromURLPlus(PreLinkOSMe,"icon pencil","Edite este mapa","",LinksAlvo);
	LinkLast90 = HrefFromURLPlus(PreLinkLast90,"icon history","Edições nos últimos 90 dias","",LinksAlvo);
	LinkOSMd   = HrefFromURLPlus(PreLinkOSMd,"icon inspect","Dados do mapa","",LinksAlvo);

	PreLinkNote      = GetLinkNote(Lat,Lon); 
	LinkNote   = HrefFromURLPlus(PreLinkNote,"icon big contact","Localizou um erro ou algo faltando? Informe pra gente :)","",LinksAlvo);

	LinkPrint  = HrefFromURLPlus("#","icon printer","Imprimir","Imprimir <small>(em breve)</small>");
	
	LinksLegenda = LinkOSMR + " " + LinkMapillary + " " + LinkF4Map + " " + LinkEcoMap + " " + LinkOSMe + " " + LinkLast90 + " " + LinkOSMd + " " + LinkNote; // + " " + LinkPrint;

	
	MakeMapControls(LinksLegenda);
//	if (MapNotesPrev.length > 0) { 	
//      legendNotes.removeLegend(MapNotesPrev);
//	}
//	MapNotesPrev = "<div class='map-notes-icon'>✚</div>" + LinkNote;
//	legendNotes.addLegend(MapNotesPrev);
	  	
}



//Default layer to show
layer_mapnik.addTo(map);  

var BaseLayers = {
//DEPRECATED
/*    
    'OpenStreetMap': layer_mapnik,
    'Light'        : layer_MapboxLight,
    'Dark'         : layer_MapboxDark,
    'Ar livre'     : layer_MapboxOutdoors,  
    'Poster Lambe-lambe'    : layer_MapboxWheatpaste,    
    'Comic'        : layer_MapboxComic,
    'Lápis'        : layer_MapboxPencil,
    'Toner'        : layer_StamenTonerL,
    'Satélite'     : layer_MapboxStreets,
    'Satélite ESRI': layer_ESRI,
    'IBGE Rural'   : layer_IBGEr,
    'IBGE Urbano'  : layer_IBGEu
*/    
};	

var Overlays = {		
   // 'Unidades de Conservação'  : olMMA,
   'Fotos do Mapillary'       : olMPLL
   // 'Microbacias Hidrográficas' : olMBH
};	

//Para evitar o erro:  "Error: Set map center and zoom first"
//map.setView([-24.1267,-48.3721], 10);DEPRECATED 

var ControlLayers = L.control.layers( BaseLayers, Overlays, {position: 'topright', collapsed: true});

//OverPassAPI overlay
map.attributionControl.addAttribution(attrOverPass);

var layer_oplAlimentacao = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='cafe']; node(BBOX)['amenity'='fast_food'];  node(BBOX)['amenity'='restaurant']; node(BBOX)['amenity'='ice_cream']; );out;"
});
var layer_oplAcomodacao = new L.OverPassLayer({
	   query: "( node(BBOX)['tourism'='hotel']; node(BBOX)['tourism'='alpine_hut'];  node(BBOX)['tourism'='apartament']; node(BBOX)['tourism'='guest_house']; node(BBOX)['tourism'='chalet']; node(BBOX)['tourism'='hostel'];  node(BBOX)['tourism'='motel'];  );out;"
   
});
var layer_oplTurismo = new L.OverPassLayer({
	   query: "( node(BBOX)['historic'='monument']; node(BBOX)['historic'='memorial']; node(BBOX)['historic'='ruins']; node(BBOX)['historic'='ruins']; node(BBOX)['tourism'='attraction'];  node(BBOX)['tourism'='artwork']; node(BBOX)['tourism'='gallery']; node(BBOX)['tourism'='information']; node(BBOX)['tourism'='museum']; node(BBOX)['tourism'='zoo']; );out;"   
});

var layer_oplTransporte = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='bicycle_parking']; node(BBOX)['amenity'='bus_station']; node(BBOX)['amenity'='car_rental']; node(BBOX)['amenity'='car_wash'];  node(BBOX)['amenity'='charging_station']; node(BBOX)['amenity'='ferry_terminal'];  node(BBOX)['amenity'='fuel'];  node(BBOX)['amenity'='parking'];  node(BBOX)['amenity'='taxi']; node(BBOX)['amenity'='bus_stop']; );out;"   
});
var layer_oplBasicos = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='post_office']; node(BBOX)['amenity'='police']; node(BBOX)['amenity'='pharmacy']; node(BBOX)['amenity'='hospital'];  node(BBOX)['amenity'='atm']; node(BBOX)['amenity'='bank']; );out;"   
});
var layer_oplNasc = new L.OverPassLayer({
	   query: "( node(BBOX)['natural'='spring']; );out;"   
});
var layer_oplLixo = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='waste_disposal']; node(BBOX)['amenity'='waste_basket']; node(BBOX)['amenity'='recycling'];  node(BBOX)['amenity'='recycling']; );out;"   
});


var olMPLL = olMPLL;
var olALIM = layer_oplAlimentacao;
var olACOM = layer_oplAcomodacao;
var olACOM = layer_oplAcomodacao;
var olTURI = layer_oplTurismo;
var olTRSP = layer_oplTransporte;
var olUTIL = layer_oplBasicos;
var olNASC = layer_oplNasc;


ControlLayers.addOverlay(olALIM, 'Onde se alimentar?');
ControlLayers.addOverlay(olACOM, 'Onde dormir?');				
ControlLayers.addOverlay(olTURI, 'Turismo');				
ControlLayers.addOverlay(olTRSP, 'Transporte');				
ControlLayers.addOverlay(olUTIL, 'Utilidades básicas');								
ControlLayers.addOverlay(olNASC, 'Nascentes');								
//ControlLayers.addOverlay(layer_oplLixo, 'Onde jogar lixo?');

ControlLayers.addTo(map);

L.control.locate().addTo(map);
		
var ControlGeocoder = new L.Control.geocoder({
		position:    'topleft',
		placeholder: 'O que procura?'
});
ControlGeocoder.addTo(map);

// var MapHash = L.hash(map);		DEPRECATED
//map.addControl(L.mapbox.shareControl());

var Escala = L.control.scale({
	maxWidth: 140
});				
Escala.addTo(map);


map.on('overlayadd', function(e) {
	 AttrIfLayerIsOn( olMPLL, attrMapillary );		     
	 AttrIfLayerIsOn( olMMA, attrMMA );		     
	 AttrIfLayerIsOn( olMBH, attrPrefMRG );		     
 });
map.on('overlayremove', function(e) {
	 AttrIfLayerIsOn( olMPLL, attrMapillary );		     
	 AttrIfLayerIsOn( olMMA, attrMMA );		     
	 AttrIfLayerIsOn( olMBH, attrPrefMRG );		     
 });


AtualizarControlesDoMapa();			
map.on('moveend', function(e) {
	AtualizarControlesDoMapa();					
});	

refreshMapillary();
map.on('dragend', function(e) {
	refreshMapillary();					
});	

//thanks to http://jsfiddle.net/3fdCD/ from http://stackoverflow.com/questions/22119535/having-trouble-with-leaflet-removelayer
$("#map-select-layer").change(function() {
	var Opcao = $("#map-select-layer option:selected").val();
	ChangeLayer(Opcao);			
});

